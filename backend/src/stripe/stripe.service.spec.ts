import Stripe from 'stripe';

import { Test, TestingModule } from '@nestjs/testing';
import { StripeService } from './stripe.service';
import { CreateStripeCustomerDto } from './dto/create-stripe-customer.dto';
import { CreateStripePriceDto } from './dto/create-stripe-price.dto';
import { CreateStripeSubscripttionDto } from './dto/create-stripe-subscription.dto';

describe('StripeService', () => {
  let stripeService: StripeService;
  let stripeClient: Stripe;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StripeService,
        {
          provide: Stripe,
          useValue: {
            customers: {
              create: jest.fn().mockReturnValue({ id: '123' }),
            },
            prices: {
              create: jest.fn().mockReturnValue({ id: '123' }),
            },
            subscriptions: {
              create: jest.fn().mockReturnValue({ id: '123' }),
            },
          },
        },
      ],
    }).compile();

    stripeService = module.get<StripeService>(StripeService);
    stripeClient = module.get<Stripe>(Stripe);
  });

  it('should be defined', () => {
    expect(stripeService).toBeDefined();
  });

  describe('createCustomer', () => {
    it('happy path', async () => {
      const createStripeCustomerDto: CreateStripeCustomerDto = {
        name: 'Mohamed',
        email: 'eng.mohamed.csd2014@gmail.com',
        metadata: {
          userId: '124',
        },
      };

      const stripeClientSpy = jest.spyOn(stripeClient.customers, 'create');
      const customerId: string = await stripeService.createCustomer(
        createStripeCustomerDto,
      );

      expect(stripeClientSpy).toHaveBeenCalledWith(createStripeCustomerDto);
      expect(stripeClientSpy).toHaveBeenCalledTimes(1);
      expect(customerId).toBe('123');
    });
  });

  describe('createPrice', () => {
    it('happy path', async () => {
      const createStripePriceDto: CreateStripePriceDto = {
        currency: 'EUR',
        unit_amount: 1000,
        recurring: {
          interval: 'day',
          interval_count: 12,
        },
        product: 'product_id',
      };
      const stripeClientSpy = jest.spyOn(stripeClient.prices, 'create');
      const productId: string =
        await stripeService.createPrice(createStripePriceDto);

      expect(stripeClientSpy).toHaveBeenCalledWith(createStripePriceDto);
      expect(stripeClientSpy).toHaveBeenCalledTimes(1);
      expect(productId).toBe('123');
    });
  });

  describe('createSubscription', () => {
    it('happy path', async () => {
      const createStripeSubscriptionDto: CreateStripeSubscripttionDto = {
        customer: 'test-customer',
        currency: 'EUR',
        items: [
          {
            price: 'price',
          },
        ],
        payment_behavior: 'default_incomplete',
      };

      const stripeClientSpy = jest.spyOn(stripeClient.subscriptions, 'create');
      const subscriptionId: string = await stripeService.createSubscription(
        createStripeSubscriptionDto,
      );
      expect(stripeClientSpy).toHaveBeenCalledWith(createStripeSubscriptionDto);
      expect(stripeClientSpy).toHaveBeenCalledTimes(1);
      expect(subscriptionId).toBe('123');
    });
  });
});
