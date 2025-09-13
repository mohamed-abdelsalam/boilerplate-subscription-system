import * as bcrypt from 'bcrypt';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { SignInDto } from './dto/sign-in-dto';
import { SignUpDto } from './dto/sign-up-dto';
import { SignInResponseDto } from './dto/sign-in-response-dto';
import { DuplicateEmailException } from './exceptions/duplicate-email-exception';
import { EmailNotFoundException } from './exceptions/email-not-found-exception';
import { SignUpResponseDto } from './dto/sign-up-response-dto';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  public async signIn(signInDto: SignInDto): Promise<SignInResponseDto> {
    const user: User = await this.usersService.findByEmail(signInDto.email);
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

    const accessToken = await this.generateAccessToken(user);

    return {
      access_token: accessToken,
    };
  }

  public async signUp(signUpDto: SignUpDto): Promise<SignUpResponseDto> {
    let user: User = await this.usersService.findByEmail(signUpDto.email);
    if (user) {
      throw new DuplicateEmailException();
    }
    user = await this.usersService.createUser({
      email: signUpDto.email,
      firstName: signUpDto.firstName,
      lastName: signUpDto.lastName,
      password: await this.hashPassword(signUpDto.password),
    });

    const accessToken = await this.generateAccessToken(user);

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

  private async generateAccessToken(user: User): Promise<string> {
    const payload = { sub: user.id, email: user.email };
    return this.jwtService.signAsync(payload);
  }
}
