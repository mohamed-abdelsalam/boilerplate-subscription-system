import { SubscriptionType } from '@subscriptions/dto/create-subscription.dto';

export class SubscriptionPaymentJob {
  userId: string;
  email: string;
  wsClientId: string;
  planId: string;
  priceId: string;
  type: SubscriptionType;

  constructor(init: Partial<SubscriptionPaymentJob>) {
    Object.assign(this, init);
  }

  generateJobId(): string {
    return `subscription:${this.userId}`;
  }
}
