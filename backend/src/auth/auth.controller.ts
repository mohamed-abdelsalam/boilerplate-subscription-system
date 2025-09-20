import { Response } from 'express';
import {
  Body,
  Controller,
  HttpStatus,
  Logger,
  Post,
  Res,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in-dto';
import { SignUpDto } from './dto/sign-up-dto';
import { Public } from './decorators/auth';
import { AuthResponse } from './dto/auth-response';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('sign-in')
  @ApiResponse({ status: 200, description: 'Signin successful' })
  @ApiResponse({ status: 401, description: 'wrong email/password' })
  public async signIn(@Body() signInDto: SignInDto, @Res() response: Response) {
    try {
      const authResponse: AuthResponse =
        await this.authService.signIn(signInDto);

      this.setResponseAuthCookies(response, authResponse);

      return response
        .status(HttpStatus.OK)
        .send({ message: 'Signin successful' });
    } catch (error) {
      Logger.log(error);

      return response
        .status(HttpStatus.UNAUTHORIZED)
        .send({ message: 'wrong email/password' });
    }
  }

  @Public()
  @Post('sign-up')
  @ApiResponse({ status: 200, description: 'Signup successful' })
  @ApiResponse({ status: 409, description: 'not able to create account' })
  public async signUp(@Body() signUpDto: SignUpDto, @Res() response: Response) {
    try {
      const authResponse: AuthResponse =
        await this.authService.signUp(signUpDto);

      this.setResponseAuthCookies(response, authResponse);

      return response
        .status(HttpStatus.OK)
        .send({ message: 'Signup successful' });
    } catch (error) {
      Logger.error(error);

      return response
        .status(HttpStatus.CONFLICT)
        .send({ message: 'not able to create account' });
    }
  }

  @Get('sign-out')
  @ApiResponse({ status: 200, description: 'Sign out successfully' })
  public async signOut(@Res() response: Response) {
    response.cookie('auth_token', null);
    response.cookie('refresh_token', null);

    return response
      .status(HttpStatus.OK)
      .send({ message: 'sign out successfully' });
  }

  private setResponseAuthCookies(
    response: Response,
    authResponse: AuthResponse,
  ) {
    response.cookie('auth_token', authResponse.authToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 1000 * 60 * 60 * 24,
    });

    response.cookie('refresh_token', authResponse.authToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 10,
    });
  }
}
