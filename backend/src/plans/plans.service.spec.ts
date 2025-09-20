import Stripe from 'stripe';

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { StripeService } from '@stripe/stripe.service';
import { PlansService } from './plans.service';
import { Plan } from './entities/plan';
import { PlanPrice } from './entities/plan-price';

describe('PlansService', () => {
  let service: PlansService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        PlansService,
        {
          provide: getRepositoryToken(Plan),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(PlanPrice),
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
