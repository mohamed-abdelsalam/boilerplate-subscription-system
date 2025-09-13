import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Subscription } from './entities/subscription';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionsRepository: Repository<Subscription>,
  ) {}

  public async getAllSubscriptionsByUserId(
    userId: string,
  ): Promise<Subscription[]> {
    return await this.subscriptionsRepository.findBy({ userId });
  }
}
