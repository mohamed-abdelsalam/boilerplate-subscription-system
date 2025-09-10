import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SignInDto } from './dto/sign-in-dto';
import { DuplicateEmailException } from './exceptions/duplicate-email-exception';
import { SignUpDto } from './dto/sign-up-dto';
import { JwtService } from '@nestjs/jwt';
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
    if (user.password !== signInDto.password) {
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
      password: signUpDto.password,
    });
    const payload = { sub: user.id, username: user.email };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      access_token: accessToken,
    };
  }
}
