import { Job, Queue } from 'bullmq';

import { Controller, Get, Post, Req } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { InjectQueue } from '@nestjs/bullmq';
import { SubscriptionsService } from './subscriptions.service';
import { Subscription } from './entities/subscription';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(
    @InjectQueue('subscription_q') private subscriptionQueue: Queue,
    private subscriptionsService: SubscriptionsService,
  ) {}

  @Post('/')
  public async createSubscription(@Req() request: Request): Promise<Job> {
    const email: string = request['user']['email'];
    const userId: string = request['user']['sub'];
    const createSubscriptionDto: CreateSubscriptionDto = {
      userId,
      email,
      subscriptionType: 'Basic',
    };

    const job: Job = await this.subscriptionQueue.add(
      'task',
      createSubscriptionDto,
    );
    return job;
  }

  @Get('/')
  public async getAllSubscriptions(): Promise<Subscription[]> {
    return this.subscriptionsService.getAllSubscriptions();
  }
}
