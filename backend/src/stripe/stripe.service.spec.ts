import Stripe from 'stripe';

import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { StripeService } from './stripe.service';

describe('StripeService', () => {
  let stripeService: StripeService;
  let stripeClient: Stripe;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
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
            invoices: {
              retrieve: jest.fn().mockReturnValue({
                confirmation_secret: { client_secret: '123' },
              }),
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
      const createStripeCustomerDto: Stripe.CustomerCreateParams = {
        name: 'Mohamed',
        email: 'eng.mohamed.csd2014@gmail.com',
        metadata: {
          userId: '124',
        },
      };

      const stripeClientSpy = jest.spyOn(stripeClient.customers, 'create');
      const { id } = await stripeService.createCustomer(
        createStripeCustomerDto,
      );

      expect(stripeClientSpy).toHaveBeenCalledWith(createStripeCustomerDto);
      expect(stripeClientSpy).toHaveBeenCalledTimes(1);
      expect(id).toBe('123');
    });
  });

  describe('createPrice', () => {
    it('happy path', async () => {
      const createStripePriceDto: Stripe.PriceCreateParams = {
        currency: 'EUR',
        unit_amount: 1000,
        recurring: {
          interval: 'day',
          interval_count: 12,
        },
        product: 'product_id',
      };
      const stripeClientSpy = jest.spyOn(stripeClient.prices, 'create');
      const { id } = await stripeService.createPrice(createStripePriceDto);

      expect(stripeClientSpy).toHaveBeenCalledWith(createStripePriceDto);
      expect(stripeClientSpy).toHaveBeenCalledTimes(1);
      expect(id).toBe('123');
    });
  });

  describe('createSubscription', () => {
    it('happy path', async () => {
      const createStripeSubscriptionDto: Stripe.SubscriptionCreateParams = {
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
      const { providerId, type } = await stripeService.initSubscription(
        createStripeSubscriptionDto,
      );
      expect(stripeClientSpy).toHaveBeenCalledWith(createStripeSubscriptionDto);
      expect(stripeClientSpy).toHaveBeenCalledTimes(1);
      expect(providerId).toBe('123');
      expect(type).toBe('subscription');
    });
  });
});
