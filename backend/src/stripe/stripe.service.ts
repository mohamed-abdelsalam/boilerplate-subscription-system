import Stripe from 'stripe';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StripeCustomer } from './entities/stripe-customer';
import { StripeSubscription } from './entities/stripe-subscription';
import { StripePrice } from './entities/stripe-price';
import { CreateStripePriceDto } from './dto/create-stripe-price.dto';
import { CreateStripeSubscripttionDto } from './dto/create-stripe-subscription.dto';
import { CreateStripeCustomerDto } from './dto/create-stripe-customer.dto';

const priceList: StripePrice[] = [];
const customersList: StripeCustomer[] = [];
const stripeSubscriptionList: StripeSubscription[] = [];

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    this.stripe = new Stripe(configService.get<string>('STRIPE_SECRET_KEY'), {
      apiVersion: '2025-08-27.basil',
    });
  }

  public async createPrice(
    createStripePriceDto: CreateStripePriceDto,
  ): Promise<void> {
    const price: Stripe.Price =
      await this.stripe.prices.create(createStripePriceDto);

    priceList.push({
      id: price.id,
    });
  }

  public async createCustomer(
    createStripeCustomerDto: CreateStripeCustomerDto,
  ): Promise<void> {
    const customer: Stripe.Customer = await this.stripe.customers.create(
      createStripeCustomerDto,
    );

    customersList.push({
      id: customer.id,
      email: createStripeCustomerDto.email,
      created: customer.created,
    });
  }

  public async createSubscription(
    createStripeSubscripttionDto: CreateStripeSubscripttionDto,
  ) {
    const stripeSubscription: Stripe.Subscription =
      await this.stripe.subscriptions.create(createStripeSubscripttionDto);

    stripeSubscriptionList.push({
      id: stripeSubscription.id,
      billing_cycle_anchor: stripeSubscription.billing_cycle_anchor,
    });
  }
}
