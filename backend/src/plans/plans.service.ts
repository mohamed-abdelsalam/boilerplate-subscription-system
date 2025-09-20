import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { StripeService } from '@stripe/stripe.service';
import { CreatePlanDto, PriceDto } from './dto/create-plan.dto';
import { Plan } from './entities/plan';
import { PlanPrice } from './entities/plan-price';

@Injectable()
export class PlansService {
  constructor(
    private stripeService: StripeService,
    @InjectRepository(Plan) private plansRepository: Repository<Plan>,
    @InjectRepository(PlanPrice) private priceRepository: Repository<PlanPrice>,
  ) {}

  public async create(
    planDto: CreatePlanDto,
    createdBy: string,
  ): Promise<Plan> {
    const product = await this.stripeService.createProduct({
      name: planDto.name,
    });
    const newPlan: Plan = this.plansRepository.create({
      name: planDto.name,
      providerId: product.id,
      createdBy: createdBy,
    });

    newPlan.prices = await this.attachPricesToPlan(newPlan, planDto.prices);

    return this.plansRepository.save(newPlan);
  }

  public async getAll(): Promise<Plan[]> {
    return this.plansRepository.find({
      relations: ['prices'],
    });
  }

  public async getPlanById(id: string): Promise<Plan> {
    return this.plansRepository.findOne({
      where: { id },
      relations: ['prices'],
    });
  }

  public async getPrice(id: string): Promise<PlanPrice> {
    return this.priceRepository.findOneBy({ id });
  }

  private async attachPricesToPlan(
    plan: Plan,
    pricesDto: PriceDto[],
  ): Promise<PlanPrice[]> {
    return Promise.all(
      pricesDto.map(async (price: PriceDto) => {
        const stripePrice = await this.stripeService.createPrice({
          currency: price.currency,
          unit_amount: price.unitAmount,
          product: plan.providerId,
          recurring: {
            interval: price.recurring.interval,
            interval_count: price.recurring.intervalCount,
          },
        });

        const planPrice = new PlanPrice({
          plan: plan,
          currency: price.currency,
          unitAmount: price.unitAmount,
          interval: price.recurring.interval,
          intervalCount: price.recurring.intervalCount,
          providerId: stripePrice.id,
        });

        return planPrice;
      }),
    );
  }
}
