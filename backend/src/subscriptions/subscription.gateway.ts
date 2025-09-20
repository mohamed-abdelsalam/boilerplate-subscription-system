import { Queue } from 'bullmq';
import { Server, Socket } from 'socket.io';

import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { InjectQueue } from '@nestjs/bullmq';

import { WsJwtGuard } from './guards/ws-jwt.guard';
import { QUEUES } from './queues/constants';
import { SubscriptionPaymentJob } from './queues/subscription-payment-job';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { PaymentProcessorResponse } from './dto/payment-processor-response';

enum MessageTypes {
  CreateSubscription = 'create-subscription',
  SubscriptionReady = 'subscription-ready',
}

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
  transports: ['websocket'],
  namespace: 'subscriptions',
})
@UseGuards(WsJwtGuard)
export class SubscriptionGateway {
  constructor(
    @InjectQueue(QUEUES.subscription)
    private readonly subscriptionQueue: Queue<SubscriptionPaymentJob>,
  ) {}

  @WebSocketServer()
  private server: Server;

  @SubscribeMessage(MessageTypes.CreateSubscription)
  public async handleSubscription(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: CreateSubscriptionDto,
  ) {
    const job = new SubscriptionPaymentJob({
      userId: (client as any)?.user?.['sub'],
      email: (client as any)?.user?.['email'],
      type: body.type,
      planId: body.planId,
      priceId: body.priceId,
      wsClientId: client.id,
    });

    await this.subscriptionQueue.add(job.generateJobId(), job);
  }

  public sendResponse(wsClientId: string, data: PaymentProcessorResponse) {
    this.server.to(wsClientId).emit(MessageTypes.SubscriptionReady, data);
  }
}
