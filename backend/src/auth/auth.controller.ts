import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in-dto';
import { SignUpDto } from './dto/sign-up-dto';
import { SignUpResponseDto } from './dto/sign-up-response-dto';
import { SignInResponseDto } from './dto/sign-in-response-dto';
import { Public } from './decorators/auth';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  public signIn(@Body() signInDto: SignInDto): Promise<SignInResponseDto> {
    return this.authService.signIn(signInDto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('sign-up')
  public signUp(@Body() signUpDto: SignUpDto): Promise<SignUpResponseDto> {
    return this.authService.signUp(signUpDto);
  }
}
