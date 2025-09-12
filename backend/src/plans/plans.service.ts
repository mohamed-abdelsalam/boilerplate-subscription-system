import { Injectable } from '@nestjs/common';

import { CreatePlanDto, Price } from './dto/create-plan.dto';
import { StripeService } from '../stripe/stripe.service';
import { Plan } from './entities/plan';

const plans: Plan[] = [];

@Injectable()
export class PlansService {
  constructor(private stripeService: StripeService) {}

  public async createPlan(createPlanDto: CreatePlanDto) {
    const productId: string = await this.stripeService.createProduct(
      createPlanDto.planName,
    );

    const plan: Plan = {
      id: productId,
      name: createPlanDto.planName,
      createdBy: createPlanDto.createdBy,
      prices: [],
    };
    await Promise.all(
      createPlanDto.prices.map(async (price: Price): Promise<void> => {
        const priceId: string = await this.stripeService.createPrice({
          currency: price.currency,
          unit_amount: price.unitAmount,
          product: productId,
          recurring: {
            interval: 'month',
            interval_count: 12,
          },
        });
        plan.prices.push({
          currency: price.currency,
          unitAmount: price.unitAmount,
          id: priceId,
        });
      }),
    );

    plans.push(plan);
  }

  public async getAllPlans(): Promise<Plan[]> {
    return plans;
  }

  public async getPlanByName(name: string): Promise<Plan> {
    return plans.filter((p) => {
      return p.name === name;
    })[0];
  }
}
