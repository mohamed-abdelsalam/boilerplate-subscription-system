import { Queue } from 'bullmq';
import { Repository } from 'typeorm';

import { Test, TestingModule } from '@nestjs/testing';
import { getQueueToken } from '@nestjs/bullmq';
import { getRepositoryToken } from '@nestjs/typeorm';

import { SubscriptionsController } from './subscriptions.controller';
import { Subscription } from './entities/subscription';
import { SubscriptionsService } from './subscriptions.service';

describe('SubscriptionsController', () => {
  let subscriptionsService: SubscriptionsService;
  let subscriptionsController: SubscriptionsController;
  let subscriptionQueue: Queue;
  let subscriptionsRepository: Repository<Subscription>;

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
        {
          provide: getRepositoryToken(Subscription),
          useValue: {
            findBy: jest.fn(),
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
    subscriptionsRepository = module.get(getRepositoryToken(Subscription));
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
      const mockReq: any = {
        user: {
          email: 'test@email.com',
          sub: '123',
        },
      };

      const subscriptionsServiceSpy = jest.spyOn(
        subscriptionsService,
        'getAllSubscriptionsByUserId',
      );
      const subscriptionsRepositorySpy = jest
        .spyOn(subscriptionsRepository, 'findBy')
        .mockImplementation(async () => {
          return [];
        });

      const subscriptions: Subscription[] =
        await subscriptionsController.getAllSubscriptionsByUser(mockReq);

      expect(subscriptions).toBeDefined();
      expect(subscriptionsServiceSpy).toHaveBeenCalledWith(mockReq.user.sub);
      expect(subscriptionsServiceSpy).toHaveBeenCalledTimes(1);
      expect(subscriptionsRepositorySpy).toHaveBeenCalledTimes(1);
      expect(subscriptionsRepositorySpy).toHaveBeenCalledWith({
        userId: mockReq.user.sub,
      });
    });
  });
});
