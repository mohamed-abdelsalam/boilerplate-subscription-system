import Stripe from 'stripe';
import { Job } from 'bullmq';
import { Repository } from 'typeorm';

import { Processor, WorkerHost } from '@nestjs/bullmq';
import { InjectRepository } from '@nestjs/typeorm';

import { StripeService } from '@stripe/stripe.service';
import { UsersService } from '@users/users.service';
import { PlansService } from '@plans/plans.service';
import { Subscription } from '@subscriptions/entities/subscription';
import { QUEUES } from '@subscriptions/queues/constants';
import { SubscriptionGateway } from '@subscriptions/subscription.gateway';
import { SubscriptionPaymentJob } from '@subscriptions/queues/subscription-payment-job';
import { PlanPrice } from '@plans/entities/plan-price';

@Processor(QUEUES.subscription)
export class SubscriptionProcessor extends WorkerHost {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionsRepository: Repository<Subscription>,
    private stripeService: StripeService,
    private usersService: UsersService,
    private plansService: PlansService,
    private subscriptionGateWay: SubscriptionGateway,
  ) {
    super();
  }

  public async process(job: Job<SubscriptionPaymentJob>): Promise<void> {
    const stripeCustomer = await this.stripeService.createCustomer({
      email: job.data.email,
      metadata: {
        userId: job.data.userId,
      },
      name: await this.usersService.getUserFullName(job.data.userId),
    });

    const selectedPrice = await this.plansService.getPrice(job.data.priceId);

    switch (job.data.type) {
      case 'subscription':
        this.processSubscription(stripeCustomer, selectedPrice, job.data);
        break;
      case 'onceoff':
        this.processOnceoff(stripeCustomer, selectedPrice, job.data);
    }
  }

  private async processSubscription(
    stripeCustomer: Stripe.Customer,
    selectedPrice: PlanPrice,
    jobData: SubscriptionPaymentJob,
  ) {
    const response = await this.stripeService.initSubscription({
      customer: stripeCustomer.id,
      items: [
        {
          price: selectedPrice.providerId,
        },
      ],
      payment_behavior: 'default_incomplete',
    });

    await this.subscriptionsRepository.save({
      userId: jobData.userId,
      providerId: response.providerId,
      priceId: selectedPrice.id,
    });

    this.subscriptionGateWay.sendResponse(jobData.wsClientId, {
      clientSecret: response.stripeClientSecret,
      publicKey: response.stripePublicKey,
    });
  }

  private async processOnceoff(
    stripeCustomer: Stripe.Customer,
    selectedPrice: PlanPrice,
    jobData: SubscriptionPaymentJob,
  ) {
    const response = await this.stripeService.initPaymentIntent(
      stripeCustomer.id,
      selectedPrice.unitAmount,
      selectedPrice.currency,
    );

    await this.subscriptionsRepository.save({
      userId: jobData.userId,
      providerId: response.providerId,
      priceId: selectedPrice.id,
    });

    this.subscriptionGateWay.sendResponse(jobData.wsClientId, {
      clientSecret: response.stripeClientSecret,
      publicKey: response.stripePublicKey,
    });
  }
}
