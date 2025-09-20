import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StripeModule } from '@stripe/stripe.module';
import { PlansService } from './plans.service';
import { Plan } from './entities/plan';
import { PlansController } from './plans.controller';
import { PlanPrice } from './entities/plan-price';

@Module({
  imports: [StripeModule, TypeOrmModule.forFeature([Plan, PlanPrice])],
  providers: [PlansService],
  controllers: [PlansController],
  exports: [PlansService],
})
export class PlansModule {}
