import { Test, TestingModule } from '@nestjs/testing';
import { StripeService } from './stripe.service';
import { ConfigModule } from '@nestjs/config';

describe('StripeService', () => {
  let stripeService: StripeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
      ],
      providers: [StripeService],
    }).compile();

    stripeService = module.get<StripeService>(StripeService);
  });

  it('should be defined', () => {
    expect(stripeService).toBeDefined();
  });

  describe('createCustomer', () => {
    it('happy path', async () => {
      await stripeService.createCustomer({
        name: 'Mohamed',
        email: 'eng.mohamed.csd2014@gmail.com',
        metadata: {
          userId: '124',
        },
      });
    });
  });

  describe('createPrice', () => {
    it('happy path', async () => {
      await stripeService.createPrice({
        currency: 'EUR',
        unit_amount: 1000,
        recurring: {
          interval: 'day',
          interval_count: 12,
        },
        product_data: {
          name: 'Basic',
        },
      });
    });
  });

  describe('createSubscription', () => {
    it('happy path', async () => {
      await stripeService.createSubscription({
        customer: 'test-customer',
        currency: 'EUR',
        items: [
          {
            price: 'price',
          },
        ],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
      });
    });
  });
});
