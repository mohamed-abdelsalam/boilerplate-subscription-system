import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { StripeService } from '@stripe/stripe.service';
import { CreatePlanDto, Price } from './dto/create-plan.dto';
import { Plan } from './entities/plan';
import { PlanPrice } from './entities/plan-price';

@Injectable()
export class PlansService {
  constructor(
    private stripeService: StripeService,
    @InjectRepository(Plan) private plansRepository: Repository<Plan>,
  ) {}

  public async createPlan(createPlanDto: CreatePlanDto): Promise<Plan> {
    const productId: string = await this.stripeService.createProduct(
      createPlanDto.planName,
    );
    const newPlan: Plan = this.plansRepository.create({
      name: createPlanDto.planName,
      providerId: productId,
      createdBy: createPlanDto.createdBy,
    });
    newPlan.prices = await Promise.all(
      createPlanDto.prices.map(async (price: Price) => {
        const priceProviderId: string = await this.stripeService.createPrice({
          currency: price.currency,
          unit_amount: price.unitAmount,
          product: productId,
          recurring: {
            interval: 'month',
            interval_count: 12,
          },
        });
        const planPrice: PlanPrice = new PlanPrice();
        planPrice.plan = newPlan;
        planPrice.currency = price.currency;
        planPrice.unitAmount = price.unitAmount;
        planPrice.providerId = priceProviderId;

        return planPrice;
      }),
    );

    return this.plansRepository.save(newPlan);
  }

  public async getAllPlans(): Promise<Plan[]> {
    return this.plansRepository.find();
  }

  public async getPlanByName(name: string): Promise<Plan> {
    return this.plansRepository.findOneBy({ name });
  }
}
