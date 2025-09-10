import { HttpException, HttpStatus } from '@nestjs/common';

export class DuplicateEmailException extends HttpException {
  constructor() {
    super('Duplicate Email', HttpStatus.CONFLICT);
  }
}
