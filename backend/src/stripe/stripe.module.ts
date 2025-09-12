import Stripe from 'stripe';

import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StripeService } from './stripe.service';

@Module({
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
