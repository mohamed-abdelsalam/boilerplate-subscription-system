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
import { WsJwtGuard } from '@auth/guards/ws-jwt.guard';
import { InjectQueue } from '@nestjs/bullmq';
import { QUEUES } from './constants';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@UseGuards(WsJwtGuard)
export class SubscriptionGateway {
  constructor(
    @InjectQueue(QUEUES.sub_placed) private subscriptionPlacesQueue: Queue,
  ) {}

  @WebSocketServer()
  private server: Server;

  @SubscribeMessage('placeSubscription')
  public async handleTask(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    const user = (client as any).user;
    const email: string = user['email'];
    const userId: string = user['sub'];
    const subscriptionType: string = data['subscriptionType'];

    return await this.subscriptionPlacesQueue.add(
      `placeSubscription:${userId}`,
      {
        email,
        userId,
        subscriptionType,
        clientId: client.id,
      },
    );
  }

  public sendResult(data: any) {
    this.server.to(data.clientId).emit('taskResults', data);
  }
}
