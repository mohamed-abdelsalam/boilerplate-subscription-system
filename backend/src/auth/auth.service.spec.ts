import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { SignInDto } from './dto/sign-in-dto';
import { UnauthorizedException } from '@nestjs/common';
import { EmailNotFoundException } from './exceptions/email-not-found-exception';
import { SignUpDto } from './dto/sign-up-dto';
import { DuplicateEmailException } from './exceptions/duplicate-email-exception';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({
        global: true,
        secret: 'secret',
        signOptions: {
          expiresIn: '60m',
        }
      })],
      providers: [AuthService, UsersService],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('test sign in', () => {
    it('happy path', async () => {
      const mockedUser = {
        email: 'test@email.com',
        password: 'password',
        firstName: 'Test',
        lastName: 'User',
        id: 1,
      };
      const usersServiceFindByEmailSpy = jest.spyOn(usersService, 'findByEmail').mockReturnValue(mockedUser);
      const jwtSpy = jest.spyOn(jwtService, 'signAsync');

      const signInDto: SignInDto = {
        email: mockedUser.email,
        password: mockedUser.password,
      };

      const response = await authService.signIn(signInDto);

      expect(usersServiceFindByEmailSpy).toHaveBeenCalledTimes(1);
      expect(jwtSpy).toHaveBeenCalledTimes(1);
      expect(response).toBeDefined();

      expect(response['access_token']).toBeDefined();
    });

    it('should throw exception when sign in with wrong password', async () => {
      const mockedUser = {
        email: 'test@email.com',
        password: 'wrong_password',
        firstName: 'Test',
        lastName: 'User',
        id: 1,
      };
      const usersServiceFindByEmailSpy = jest.spyOn(usersService, 'findByEmail').mockReturnValue(mockedUser);

      const signInDto: SignInDto = {
        email: mockedUser.email,
        password: 'password',
      };

      authService.signIn(signInDto)
      .then(() => {
        fail('should throw exception');
      })
      .catch((exception) => {
        expect(usersServiceFindByEmailSpy).toHaveBeenCalledTimes(1);
        expect(exception).toBeInstanceOf(UnauthorizedException);
      });
    });
    it('should fail when there is no account with given email', async () => {
      const signInDto: SignInDto = {
        email: 'not_found@email.com',
        password: 'password',
      };
      const usersServiceFindByEmailSpy = jest.spyOn(usersService, 'findByEmail');
      authService.signIn(signInDto)
      .then(() => {
        fail('should throw exception')
      })
      .catch((exception) => {
        expect(usersServiceFindByEmailSpy).toHaveBeenCalledTimes(1);
        expect(exception).toBeInstanceOf(EmailNotFoundException)
      });
    });
  });

  describe('test sign up', () => {
    it('happy path', async () => {
      const signUpDto: SignUpDto = {
        email: 'test@email.com',
        password: 'password',
        firstName: 'Test',
        lastName: 'User',
      };
      const usersServiceFindByEmailSpy = jest.spyOn(usersService, 'findByEmail');
      const usersServiceCreateUserSpy = jest.spyOn(usersService, 'createUser');

      const signUpResponse = await authService.signUp(signUpDto);

      expect(usersServiceCreateUserSpy).toHaveBeenCalledTimes(1);
      expect(usersServiceFindByEmailSpy).toHaveBeenCalledTimes(1);

      expect(signUpResponse).toBeDefined();
      expect(signUpResponse['access_token']).toBeDefined();
    });

    it('should throw exception when sign up with existing email', async () => {
      const signUpDto: SignUpDto = {
        email: 'test@email.com',
        password: 'password',
        firstName: 'Test',
        lastName: 'User',
      };

      const usersServiceFindByEmailSpy = jest.spyOn(usersService, 'findByEmail').mockReturnValue({
        email: 'test@email.com',
        password: 'password',
        firstName: 'Test',
        lastName: 'User',
      });
      const usersServiceCreateUserSpy = jest.spyOn(usersService, 'createUser');
      authService.signUp(signUpDto)
        .then(() => {
          fail('should throw exception');
        })
        .catch((exception) => {
          expect(exception).toBeInstanceOf(DuplicateEmailException);
          expect(usersServiceFindByEmailSpy).toHaveBeenCalledTimes(1);
          expect(usersServiceCreateUserSpy).toHaveBeenCalledTimes(0);
        });
    });
  });
});
