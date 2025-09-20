export class PaymentResponse {
  providerId: string;
  type: PaymentResponseType;
  stripePublicKey: string;
  stripeClientSecret: string;
}

type PaymentResponseType = 'subscription' | 'payment-intent';
