import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule } from '@nestjs/config';

import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionProcessor } from './processors/subscription.processor';

import { StripeModule } from '../stripe/stripe.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from './entities/subscription';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Subscription]),
    StripeModule,
    BullModule.registerQueue({
      name: 'subscription_q',
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
  ],
  providers: [SubscriptionsService, SubscriptionProcessor],
  controllers: [SubscriptionsController],
})
export class SubscriptionsModule {}
