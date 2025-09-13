import { HttpException, HttpStatus } from '@nestjs/common';

export class EmailNotFoundException extends HttpException {
  constructor() {
    super('Email not found exception', HttpStatus.NOT_FOUND);
  }
}
