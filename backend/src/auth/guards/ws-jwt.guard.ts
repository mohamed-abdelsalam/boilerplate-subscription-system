import { Socket } from 'socket.io';

import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { verifyJwtToken } from './guard.util';

export class WsJwtGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient();
    (client as any).user = await verifyJwtToken(
      this.jwtService,
      client.handshake.headers?.authorization,
    );

    return true;
  }
}
