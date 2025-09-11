import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PaymentsModule } from './payments/payments.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { StripeModule } from './stripe/stripe.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    ConfigModule.forRoot(),
    PaymentsModule,
    SubscriptionsModule,
    StripeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
