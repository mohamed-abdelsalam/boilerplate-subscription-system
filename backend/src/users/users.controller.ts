import { Response } from 'express';

import { Controller, Get, HttpStatus, Req, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/')
  public async profile(@Req() request: Request, @Res() response: Response) {
    const userPayload: User = await this.usersService.findById(
      request['user']['sub'],
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = userPayload;
    return response.status(HttpStatus.OK).json(rest);
  }
}
