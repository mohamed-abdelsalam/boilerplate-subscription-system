import Stripe from 'stripe';

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { StripeService } from '@stripe/stripe.service';
import { PlansController } from './plans.controller';
import { PlansService } from './plans.service';
import { Plan } from './entities/plan';

describe('PlansController', () => {
  let controller: PlansController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
      ],
      controllers: [PlansController],
    }).compile();

    controller = module.get<PlansController>(PlansController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
