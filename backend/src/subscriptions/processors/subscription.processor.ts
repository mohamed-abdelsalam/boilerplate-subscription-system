import { Job } from 'bullmq';
import { Repository } from 'typeorm';

import { Processor, WorkerHost } from '@nestjs/bullmq';

import { StripeService } from '@stripe/stripe.service';
import { UsersService } from '@users/users.service';
import { Plan } from '@plans/entities/plan';
import { PlansService } from '@plans/plans.service';
import { Subscription } from '@subscriptions/entities/subscription';
import { InjectRepository } from '@nestjs/typeorm';
import { QUEUES } from '@subscriptions/constants';
import { SubscriptionGateway } from '@subscriptions/subscription.gateway';

@Processor(QUEUES.sub_placed)
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

  public async process(job: Job): Promise<any> {
    const userId: string = job.data['userId'];
    const email: string = job.data['email'];
    const subscriptionType: string = job.data['subscriptionType'];
    const clientId: string = job.data['clientId'];

    const stripeCustomerId: string = await this.stripeService.createCustomer({
      email: email,
      metadata: {
        userId: userId,
      },
      name: await this.usersService.getUserFullName(userId),
    });

    const selectedPlan: Plan =
      await this.plansService.getPlanByName(subscriptionType);

    const providerSubscriptionId: string =
      await this.stripeService.createSubscription({
        currency: selectedPlan.prices[0].currency,
        customer: stripeCustomerId,
        items: [
          {
            price: selectedPlan.prices[0].id,
          },
        ],
        payment_behavior: 'default_incomplete',
      });
    let newSubscription: Subscription = this.subscriptionsRepository.create({
      providerSubscriptionId,
      userId,
      subscriptionType,
    });
    newSubscription = await this.subscriptionsRepository.save(newSubscription);
    this.subscriptionGateWay.sendResult({
      ...newSubscription,
      clientId,
    });
  }
}
