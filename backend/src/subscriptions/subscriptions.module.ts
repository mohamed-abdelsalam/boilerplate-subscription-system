import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionGateway } from './subscription.gateway';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionProcessor } from './processors/subscription.processor';

import { StripeModule } from '../stripe/stripe.module';
import { Subscription } from './entities/subscription';
import { QUEUES } from './constants';
import { UsersModule } from '@users/users.module';
import { PlansModule } from '@plans/plans.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subscription]),
    StripeModule,
    UsersModule,
    PlansModule,
    BullModule.registerQueue({ name: QUEUES.sub_placed }),
  ],
  providers: [SubscriptionsService, SubscriptionGateway, SubscriptionProcessor],
  controllers: [SubscriptionsController],
})
export class SubscriptionsModule {}
