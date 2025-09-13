import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StripeModule } from '@stripe/stripe.module';
import { PlansService } from './plans.service';
import { Plan } from './entities/plan';
import { PlansController } from './plans.controller';

@Module({
  imports: [StripeModule, TypeOrmModule.forFeature([Plan])],
  providers: [PlansService],
  controllers: [PlansController],
})
export class PlansModule {}
