import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionGateway } from './subscription.gateway';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionProcessor } from './processors/subscription.processor';

import { StripeModule } from '../stripe/stripe.module';
import { Subscription } from './entities/subscription';
import { QUEUES } from './queues/constants';
import { UsersModule } from '@users/users.module';
import { PlansModule } from '@plans/plans.module';
import { AuthModule } from '@auth/auth.module';
import { WsJwtGuard } from './guards/ws-jwt.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subscription]),
    ConfigModule,
    StripeModule,
    UsersModule,
    PlansModule,
    BullModule.registerQueue({ name: QUEUES.subscription }),
    AuthModule,
  ],
  providers: [
    WsJwtGuard,
    SubscriptionsService,
    SubscriptionGateway,
    SubscriptionProcessor,
  ],
  controllers: [SubscriptionsController],
})
export class SubscriptionsModule {}
