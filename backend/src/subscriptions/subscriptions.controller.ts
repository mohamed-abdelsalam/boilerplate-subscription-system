import { Request, Response } from 'express';

import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Get, HttpStatus, Logger, Req, Res } from '@nestjs/common';

import { SubscriptionsService } from './subscriptions.service';

@ApiTags('subscriptions')
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private subscriptionsService: SubscriptionsService) {}

  @Get('/')
  @ApiResponse({ status: 200, description: 'Get all subscription by user' })
  @ApiBearerAuth()
  public async getAllSubscriptionsByUser(
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const userId = req['user']['sub'];
      const subscriptions =
        await this.subscriptionsService.getAllSubscriptionsByUserId(userId);
      return res.status(HttpStatus.OK).send(subscriptions);
    } catch (error) {
      Logger.error('Failed to get list of subscriptions');
      return res
        .status(HttpStatus.BAD_GATEWAY)
        .send(`Failed to get list of subscriptions ${error}`);
    }
  }
}
