import { Controller, Get, Req } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { Subscription } from './entities/subscription';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private subscriptionsService: SubscriptionsService) {}

  @Get('/')
  public async getAllSubscriptionsByUser(
    @Req() request: Request,
  ): Promise<Subscription[]> {
    const userId: string = request['user']['sub'];
    return this.subscriptionsService.getAllSubscriptionsByUserId(userId);
  }
}
