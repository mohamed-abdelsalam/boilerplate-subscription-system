import { Controller, Get, Req, UseGuards } from '@nestjs/common';

@Controller('users')
export class UsersController {

  @Get('/')
  public async profile(@Req() request: Request) {
    return request['user'];
  }
}
