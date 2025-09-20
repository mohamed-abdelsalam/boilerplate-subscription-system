import { Request, Response } from 'express';

import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Post,
  Req,
  Res,
} from '@nestjs/common';

import { Public } from '@auth/decorators/auth';
import { PlansService } from './plans.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Plan } from './entities/plan';

@ApiTags('plans')
@Controller('plans')
export class PlansController {
  constructor(private plansService: PlansService) {}

  @Post()
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'create plan successfully' })
  @ApiResponse({ status: 400, description: 'failed to create a plan' })
  public async create(
    @Req() req: Request,
    @Body() body: CreatePlanDto,
    @Res() res: Response,
  ) {
    try {
      const plan: Plan = await this.plansService.create(
        body,
        req['user']['sub'],
      );
      return res.status(HttpStatus.OK).send(plan);
    } catch (error) {
      Logger.error('Failed to create plan');
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send(`Failed to create plan: ${error}`);
    }
  }

  @Public()
  @Get()
  @ApiResponse({ status: 200, description: 'get plans successfully' })
  @ApiResponse({ status: 400, description: 'failed to get plans' })
  public async getAll(@Res() res: Response) {
    try {
      const plans: Plan[] = await this.plansService.getAll();
      return res.status(HttpStatus.OK).send(plans);
    } catch (error) {
      Logger.error('Failed to get plans');
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send(`Failed to get plans: ${error}`);
    }
  }
}
