import Stripe from 'stripe';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { PaymentResponse } from './dto/payment-response';

@Injectable()
export class StripeService {
  constructor(
    private readonly stripe: Stripe,
    private readonly configService: ConfigService,
  ) {}

  public async createProduct(
    param: Stripe.ProductCreateParams,
  ): Promise<Stripe.Product> {
    return this.stripe.products.create(param);
  }

  public async createPrice(
    param: Stripe.PriceCreateParams,
  ): Promise<Stripe.Price> {
    return this.stripe.prices.create(param);
  }

  public async createCustomer(
    param: Stripe.CustomerCreateParams,
  ): Promise<Stripe.Customer> {
    return this.stripe.customers.create(param);
  }

  private async getInvoice(id: string): Promise<Stripe.Invoice> {
    return this.stripe.invoices.retrieve(id, {
      expand: ['confirmation_secret'],
    });
  }

  public constructWebhookEvent(payload: any, sig: string): Stripe.Event {
    return this.stripe.webhooks.constructEvent(
      payload,
      sig,
      this.configService.get<string>('STRIPE_WEBHOOK_SECRET'),
    );
  }

  public async initSubscription(
    param: Stripe.SubscriptionCreateParams,
  ): Promise<PaymentResponse> {
    const subscription: Stripe.Subscription =
      await this.stripe.subscriptions.create(param);

    const {
      confirmation_secret: { client_secret },
    } = await this.getInvoice(subscription.latest_invoice as string);

    return {
      providerId: subscription.id,
      type: 'subscription',
      stripePublicKey: this.configService.get<string>('STRIPE_PUBLIC_KEY'),
      stripeClientSecret: client_secret,
    };
  }

  public async initPaymentIntent(
    customer: string,
    amount: number,
    currency: string,
  ): Promise<PaymentResponse> {
    const paymentIntent: Stripe.PaymentIntent =
      await this.stripe.paymentIntents.create({
        amount,
        customer,
        currency,
        automatic_payment_methods: {
          enabled: true,
        },
      });

    return {
      providerId: paymentIntent.id,
      type: 'payment-intent',
      stripePublicKey: this.configService.get<string>('STRIPE_PUBLIC_KEY'),
      stripeClientSecret: paymentIntent.client_secret,
    };
  }
}
