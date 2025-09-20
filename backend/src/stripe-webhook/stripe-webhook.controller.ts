import Stripe from 'stripe';
import { Request, Response } from 'express';

import { ApiTags } from '@nestjs/swagger';
import { Controller, HttpStatus, Logger, Post, Req, Res } from '@nestjs/common';
import { StripeService } from '@stripe/stripe.service';
import { Public } from '@auth/decorators/auth';

@ApiTags('stripe-webhook')
@Controller('stripe-webhook')
export class StripeWebhookController {
  constructor(private readonly stripeService: StripeService) {}

  @Public()
  @Post()
  async handleWebhook(@Req() req: Request, @Res() res: Response) {
    const sig = req.headers['stripe-signature'] as string;

    let event: Stripe.Event;

    try {
      event = this.stripeService.constructWebhookEvent(req.body, sig);
    } catch (err) {
      Logger.error('Webhook signature verification failed', err);

      return res
        .status(HttpStatus.BAD_REQUEST)
        .send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
      case 'payment_intent.succeeded':
        Logger.log('payment_intent succeeded', event.data);
        break;
      default:
        Logger.warn('Unhandled event type', event.type);
    }
  }
}
