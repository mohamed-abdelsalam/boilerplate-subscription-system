import { Module } from '@nestjs/common';
import { PlansService } from './plans.service';
import { StripeModule } from '../stripe/stripe.module';

@Module({
  imports: [StripeModule],
  providers: [PlansService],
})
export class PlansModule {}
