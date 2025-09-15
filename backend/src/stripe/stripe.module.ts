import Stripe from 'stripe';

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StripeService } from './stripe.service';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: Stripe,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        new Stripe(configService.get<string>('STRIPE_SECRET_KEY'), {
          apiVersion: '2025-08-27.basil',
        }),
    },
    StripeService,
  ],
  exports: [StripeService],
})
export class StripeModule {}
