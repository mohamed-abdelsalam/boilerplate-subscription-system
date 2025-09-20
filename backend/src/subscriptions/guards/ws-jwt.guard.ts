import { Socket } from 'socket.io';

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient();
    const cookiesHeader: string = client.handshake.headers.cookie;
    if (!cookiesHeader) {
      Logger.error('no cookie header');
      throw new UnauthorizedException('no cookie header');
    }
    const cookies = Object.fromEntries(
      cookiesHeader.split('; ').map((s) => {
        const [k, v] = s.split('=');
        return [k, v];
      }),
    );

    (client as any).user = await this.verifyJwtToken(cookies['auth_token']);

    return true;
  }

  async verifyJwtToken(authToken: string) {
    try {
      return await this.jwtService.verifyAsync(authToken, {
        secret: this.configService.get<string>('JWT_SECRETS'),
      });
    } catch (error) {
      Logger.error(error);
      throw new UnauthorizedException(error);
    }
  }
}
