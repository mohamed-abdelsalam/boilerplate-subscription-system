export class CreateStripePriceDto {
  currency: string;
  unit_amount: number;
  recurring: RecurringStripePrice;
  product_data: ProductData;
}

export class RecurringStripePrice {
  interval: BillingFrequency;
  interval_count: number;
}

export class ProductData {
  name: string;
}

type BillingFrequency = 'day' | 'week' | 'month' | 'year';
