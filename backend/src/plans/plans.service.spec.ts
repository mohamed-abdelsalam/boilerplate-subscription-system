import Stripe from 'stripe';

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { StripeService } from '@stripe/stripe.service';
import { PlansService } from './plans.service';
import { Plan } from './entities/plan';

describe('PlansService', () => {
  let service: PlansService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlansService,
        {
          provide: getRepositoryToken(Plan),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
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
