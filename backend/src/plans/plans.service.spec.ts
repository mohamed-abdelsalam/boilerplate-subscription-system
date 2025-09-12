import Stripe from 'stripe';

import { Test, TestingModule } from '@nestjs/testing';
import { PlansService } from './plans.service';
import { StripeService } from '../stripe/stripe.service';

describe('PlansService', () => {
  let service: PlansService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlansService,
        StripeService,
        {
          provide: Stripe,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<PlansService>(PlansService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
