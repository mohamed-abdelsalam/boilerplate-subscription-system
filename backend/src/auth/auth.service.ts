import bcrypt from 'bcrypt';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';
import { SignInDto } from './dto/sign-in-dto';
import { DuplicateEmailException } from './exceptions/duplicate-email-exception';
import { SignUpDto } from './dto/sign-up-dto';
import { SignInResponseDto } from './dto/sign-in-response-dto';
import { EmailNotFoundException } from './exceptions/email-not-found-exception';
import { SignUpResponseDto } from './dto/sign-up-response-dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  public async signIn(signInDto: SignInDto): Promise<SignInResponseDto> {
    const user = await this.usersService.findByEmail(signInDto.email);
    if (user === undefined) {
      throw new EmailNotFoundException();
    }
    const isPasswordCorrect: boolean = await this.comparePassword(
      signInDto.password,
      user.password,
    );
    if (!isPasswordCorrect) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id, username: user.email };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      access_token: accessToken,
    };
  }

  public async signUp(signUpDto: SignUpDto): Promise<SignUpResponseDto> {
    let user = await this.usersService.findByEmail(signUpDto.email);
    if (user) {
      throw new DuplicateEmailException();
    }
    user = this.usersService.createUser({
      email: signUpDto.email,
      firstName: signUpDto.firstName,
      lastName: signUpDto.lastName,
      password: await this.hashPassword(signUpDto.password),
    });
    const payload = { sub: user.id, username: user.email };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      access_token: accessToken,
    };
  }

  private async hashPassword(plainTextPassword: string): Promise<string> {
    return bcrypt.hash(plainTextPassword, 10);
  }

  private async comparePassword(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainTextPassword, hashedPassword);
  }
}
