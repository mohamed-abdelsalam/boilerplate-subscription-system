import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '@users/users.module';
import { User } from '@users/entities/user';
import { AuthModule } from '@auth/auth.module';
import { SubscriptionsModule } from '@subscriptions/subscriptions.module';
import { Subscription } from '@subscriptions/entities/subscription';
import { StripeModule } from '@stripe/stripe.module';
import { PlansModule } from '@plans/plans.module';
import { Plan } from '@plans/entities/plan';
import { PlanPrice } from '@plans/entities/plan-price';
import { StripeWebhookController } from './stripe-webhook/stripe-webhook.controller';
import { StripeWebhookModule } from './stripe-webhook/stripe-webhook.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          database: configService.get<string>('DB_NAME'),
          username: configService.get<string>('DB_USER'),
          password: configService.get<string>('DB_PASSWORD'),
          type: 'postgres',
          entities: [User, Plan, Subscription, PlanPrice],
          synchronize: true,
        };
      },
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
        },
      }),
    }),
    UsersModule,
    AuthModule,
    SubscriptionsModule,
    StripeModule,
    PlansModule,
    StripeWebhookModule,
  ],
  controllers: [AppController, StripeWebhookController],
  providers: [AppService],
})
export class AppModule {}
