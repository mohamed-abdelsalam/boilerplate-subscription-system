import { Job } from 'bullmq';

import { Processor, WorkerHost } from '@nestjs/bullmq';

import { StripeService } from '@stripe/stripe.service';
import { UsersService } from '@users/users.service';
import { Plan } from '@plans/entities/plan';
import { PlansService } from '@plans/plans.service';

@Processor('subscription_q')
export class SubscriptionProcessor extends WorkerHost {
  constructor(
    private stripeService: StripeService,
    private usersService: UsersService,
    private plansService: PlansService,
  ) {
    super();
  }

  public async process(job: Job): Promise<any> {
    const userId: string = job.data['userId'];
    const email: string = job.data['email'];
    const subscriptionType: string = job.data['subscriptionType'];

    const stripeCustomerId: string = await this.stripeService.createCustomer({
      email: email,
      metadata: {
        userId: userId,
      },
      name: await this.usersService.getUserFullName(userId),
    });

    const selectedPlan: Plan =
      await this.plansService.getPlanByName(subscriptionType);

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
  }
}
