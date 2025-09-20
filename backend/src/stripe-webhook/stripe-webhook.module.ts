import { Module } from '@nestjs/common';

import { StripeModule } from '@stripe/stripe.module';
import { StripeWebhookController } from './stripe-webhook.controller';

@Module({
  imports: [StripeModule],
  controllers: [StripeWebhookController],
})
export class StripeWebhookModule {}
