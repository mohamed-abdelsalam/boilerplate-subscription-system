import { Injectable } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { Subscription } from './entities/subscription';
import { StripeService } from '../stripe/stripe.service';

const subscriptions: Subscription[] = [];

@Injectable()
export class SubscriptionsService {
  constructor(private stripeService: StripeService) {}

  public async createSubscription(
    createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<void> {
    subscriptions.push({
      userId: createSubscriptionDto.userId,
      subscriptionType: createSubscriptionDto.subscriptionType,
      createdAt: Date.now(),
    });
  }

  public async getAllSubscriptions(): Promise<Subscription[]> {
    return subscriptions;
  }
}
