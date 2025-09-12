import { Controller, Post, Req } from '@nestjs/common';
import { PlansService } from './plans.service';

@Controller('plans')
export class PlansController {
  constructor(private plansService: PlansService) {}

  @Post()
  public async createPlan(@Req() request: Request) {
    await this.plansService.createPlan({
      planName: request.body['planName'],
      createdBy: request['user']['sub'],
      prices: request.body['prices'],
    });
  }
}
