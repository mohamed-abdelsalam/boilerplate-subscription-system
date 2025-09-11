export class CreateStripeCustomerDto {
  name: string;
  email: string;
  metadata: Record<string, string>;
}
