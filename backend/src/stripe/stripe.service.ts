import Stripe from 'stripe';

import { Injectable } from '@nestjs/common';

import { CreateStripePriceDto } from './dto/create-stripe-price.dto';
import { CreateStripeSubscripttionDto } from './dto/create-stripe-subscription.dto';
import { CreateStripeCustomerDto } from './dto/create-stripe-customer.dto';

@Injectable()
export class StripeService {
  constructor(private readonly stripe: Stripe) {}

  public async createProduct(productName: string): Promise<string> {
    const product: Stripe.Product = await this.stripe.products.create({
      name: productName,
    });
    return product.id;
  }

  public async createPrice(
    createStripePriceDto: CreateStripePriceDto,
  ): Promise<string> {
    const price: Stripe.Price =
      await this.stripe.prices.create(createStripePriceDto);

    return price.id;
  }

  public async createCustomer(
    createStripeCustomerDto: CreateStripeCustomerDto,
  ): Promise<string> {
    const customer: Stripe.Customer = await this.stripe.customers.create(
      createStripeCustomerDto,
    );

    return customer.id;
  }

  public async createSubscription(
    createStripeSubscripttionDto: CreateStripeSubscripttionDto,
  ): Promise<string> {
    const subscription: Stripe.Subscription =
      await this.stripe.subscriptions.create(createStripeSubscripttionDto);

    return subscription.id;
  }
}
