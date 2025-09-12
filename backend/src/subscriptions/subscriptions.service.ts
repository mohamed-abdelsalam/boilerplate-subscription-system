import { Injectable } from '@nestjs/common';
import { Subscription } from './entities/subscription';

const subscriptions: Subscription[] = [];

@Injectable()
export class SubscriptionsService {
  constructor() {}

  public async getAllSubscriptions(): Promise<Subscription[]> {
    return subscriptions;
  }
}
