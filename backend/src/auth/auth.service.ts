import * as bcrypt from 'bcrypt';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '@users/users.service';
import { User } from '@users/entities/user';
import { SignInDto } from './dto/sign-in-dto';
import { SignUpDto } from './dto/sign-up-dto';
import { AuthResponse } from './dto/auth-response';
import { DuplicateEmailException } from './exceptions/duplicate-email-exception';
import { EmailNotFoundException } from './exceptions/email-not-found-exception';

const saltOrRounds: number = 10;

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  public async signIn(signInDto: SignInDto): Promise<AuthResponse> {
    const user: User = await this.usersService.findByEmail(signInDto.email);
    if (user === undefined) {
      throw new EmailNotFoundException();
    }
    const isPasswordCorrect: boolean = await bcrypt.compare(
      signInDto.password,
      user.password,
    );
    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Wrong password!');
    }

    return await this.generateAuthResponse(user);
  }

  public async signUp(signUpDto: SignUpDto): Promise<AuthResponse> {
    let user: User = await this.usersService.findByEmail(signUpDto.email);
    if (user) {
      throw new DuplicateEmailException();
    }
    user = await this.usersService.createUser({
      email: signUpDto.email,
      firstName: signUpDto.firstName,
      lastName: signUpDto.lastName,
      password: await bcrypt.hash(signUpDto.password, saltOrRounds),
    });

    return await this.generateAuthResponse(user);
  }

  private async generateAuthResponse(user: User): Promise<AuthResponse> {
    const payload = { sub: user.id, email: user.email };
    return {
      authToken: await this.jwtService.signAsync(payload, {
        expiresIn: '1d',
      }),
      refreshToken: await this.jwtService.signAsync(payload, {
        expiresIn: '10d',
      }),
    };
  }
}
