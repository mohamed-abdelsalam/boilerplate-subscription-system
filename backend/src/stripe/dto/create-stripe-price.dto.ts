export class CreateStripePriceDto {
  currency: string;
  unit_amount: number;
  recurring: RecurringStripePrice;
  product: string;
}

export class RecurringStripePrice {
  interval: BillingFrequency;
  interval_count: number;
}

type BillingFrequency = 'day' | 'week' | 'month' | 'year';
