export class CreateStripeSubscripttionDto {
  customer: string;
  currency: string;
  items: SubscriptionItem[];
  payment_behavior: PaymentBehavior;
  readonly expand: string[] = ['latest_invoice.payment_intent'];
}

class SubscriptionItem {
  price: string;
}

type PaymentBehavior =
  | 'allow_incomplete'
  | 'default_incomplete'
  | 'error_if_incomplete'
  | 'pending_if_incomplete';
