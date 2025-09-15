import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

export async function verifyJwtToken(
  jwtService: JwtService,
  configService: ConfigService,
  authToken: string,
) {
  try {
    return await jwtService.verifyAsync(authToken, {
      secret: configService.get<string>('JWT_SECRETS'),
    });
  } catch (error) {
    throw new UnauthorizedException(error);
  }
}
