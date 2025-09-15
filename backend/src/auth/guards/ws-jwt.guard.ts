import { Socket } from 'socket.io';

import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { verifyJwtToken } from './guard.util';

export class WsJwtGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient();
    const cookiesHeader: string = client.handshake.headers.cookie;
    if (!cookiesHeader) {
      throw new UnauthorizedException('no cookie header');
    }
    const cookies = Object.fromEntries(
      cookiesHeader.split(';').map((s) => {
        const [k, v] = s.split('=');
        return [k, v];
      }),
    );

    (client as any).user = await verifyJwtToken(
      this.jwtService,
      this.configService,
      cookies['auth_token'],
    );

    return true;
  }
}
