import { Controller, Get, Post, Req } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private subscriptionsService: SubscriptionsService) {}

  @Post('/')
  public async createSubscription(@Req() request: Request) {
    const email: string = request['user']['email'];
    const userId: string = request['user']['sub'];
    const createSubscriptionDto: CreateSubscriptionDto = {
      userId,
      email,
      subscriptionType: 'Basic',
    };

    this.subscriptionsService.createSubscription(createSubscriptionDto);
  }

  @Get('/')
  public async getAllSubscriptions(@Req() request: Request): Promise<any> {
    const user: any = request['user'];

    return {
      user,
      subscriptionList: await this.subscriptionsService.getAllSubscriptions(),
    };
  }
}
