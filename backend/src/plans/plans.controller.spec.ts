import Stripe from 'stripe';

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { StripeService } from '@stripe/stripe.service';
import { PlansController } from './plans.controller';
import { PlansService } from './plans.service';
import { Plan } from './entities/plan';
import { PlanPrice } from './entities/plan-price';

describe('PlansController', () => {
  let controller: PlansController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        PlansService,
        StripeService,
        {
          provide: Stripe,
          useValue: {},
        },
        {
          provide: getRepositoryToken(Plan),
          useValue: {},
        },
        {
          provide: getRepositoryToken(PlanPrice),
          useValue: {},
        },
      ],
      controllers: [PlansController],
    }).compile();

    controller = module.get<PlansController>(PlansController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
