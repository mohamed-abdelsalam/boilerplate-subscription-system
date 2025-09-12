import { Queue } from 'bullmq';

import { Test, TestingModule } from '@nestjs/testing';
import { getQueueToken } from '@nestjs/bullmq';
import { SubscriptionsController } from './subscriptions.controller';
import { Subscription } from './entities/subscription';
import { SubscriptionsService } from './subscriptions.service';

describe('SubscriptionsController', () => {
  let subscriptionsService: SubscriptionsService;
  let subscriptionsController: SubscriptionsController;
  let subscriptionQueue: Queue;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubscriptionsController],
      providers: [
        SubscriptionsService,
        {
          provide: getQueueToken('subscription_q'),
          useValue: {
            add: jest.fn().mockReturnValue('job'),
          },
        },
      ],
    }).compile();

    subscriptionsController = module.get<SubscriptionsController>(
      SubscriptionsController,
    );
    subscriptionsService =
      module.get<SubscriptionsService>(SubscriptionsService);
    subscriptionQueue = module.get<Queue>(getQueueToken('subscription_q'));
  });

  it('should be defined', () => {
    expect(subscriptionsController).toBeDefined();
  });

  describe('createSubscription', () => {
    it('happy path', async () => {
      const mockReq: any = {
        user: {
          email: 'test@email.com',
          sub: '123',
        },
      };
      const job = await subscriptionsController.createSubscription(mockReq);

      const queueSpy = jest.spyOn(subscriptionQueue, 'add');

      expect(queueSpy).toHaveBeenCalledTimes(1);
      expect(job).toBeDefined();
    });
  });

  describe('getAllSubscriptions', () => {
    it('happy path', async () => {
      const subscriptionsServiceSpy = jest.spyOn(
        subscriptionsService,
        'getAllSubscriptions',
      );
      const subscriptions: Subscription[] =
        await subscriptionsController.getAllSubscriptions();

      expect(subscriptions).toBeDefined();
      expect(subscriptionsServiceSpy).toHaveBeenCalledTimes(1);
    });
  });
});
