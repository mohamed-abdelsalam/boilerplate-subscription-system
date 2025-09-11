export class CreateSubscriptionDto {
  userId: string;
  email: string;
  subscriptionType: SubscriptionType;
}

type SubscriptionType = 'Basic' | 'Premium';
