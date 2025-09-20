import { ApiProperty } from '@nestjs/swagger';
import { MinLength } from 'class-validator';

export class SignInDto {
  @ApiProperty({ example: 'alice@example.com' })
  email: string;

  @ApiProperty({ example: '123456', minLength: 6 })
  @MinLength(6)
  password: string;
}
