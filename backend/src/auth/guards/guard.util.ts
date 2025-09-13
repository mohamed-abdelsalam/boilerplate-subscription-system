import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '@auth/constants';

export async function verifyJwtToken(
  jwtService: JwtService,
  authHeader: string,
) {
  try {
    const token = authHeader.replace('Bearer ', '');

    return await jwtService.verifyAsync(token, { secret: jwtConstants.secret });
  } catch (error) {
    throw new UnauthorizedException(error);
  }
}
