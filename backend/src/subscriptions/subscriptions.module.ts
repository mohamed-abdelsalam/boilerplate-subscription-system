import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionGateway } from './subscription.gateway';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionProcessor } from './processors/subscription.processor';

import { StripeModule } from '../stripe/stripe.module';
import { Subscription } from './entities/subscription';
import { QUEUES } from './constants';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Subscription]),
    StripeModule,
    BullModule.registerQueueAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          name: QUEUES.sub_placed,
          connection: {
            host: configService.get<string>('REDIS_HOST'),
            port: configService.get<number>('REDIS_PORT'),
          },
        };
      },
    }),
  ],
  providers: [SubscriptionsService, SubscriptionGateway, SubscriptionProcessor],
  controllers: [SubscriptionsController],
})
export class SubscriptionsModule {}
