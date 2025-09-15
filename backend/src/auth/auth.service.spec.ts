import * as bcrypt from 'bcrypt';

import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';

import { UsersService } from '@users/users.service';
import { User } from '@users/entities/user';

import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in-dto';
import { SignUpDto } from './dto/sign-up-dto';
import { EmailNotFoundException } from './exceptions/email-not-found-exception';
import { DuplicateEmailException } from './exceptions/duplicate-email-exception';
import { AuthResponse } from './dto/auth-response';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          global: true,
          secret: 'secret',
        }),
      ],
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn(),
            findOneBy: jest.fn(),
            save: jest.fn(),
          },
        },
        UsersService,
      ],
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
        password: await bcrypt.hash('password', 10),
        firstName: 'Test',
        lastName: 'User',
        id: '1',
      };
      const usersServiceFindByEmailSpy = jest
        .spyOn(usersService, 'findByEmail')
        .mockImplementation(async () => mockedUser);
      const jwtSpy = jest.spyOn(jwtService, 'signAsync');

      const signInDto: SignInDto = {
        email: mockedUser.email,
        password: 'password',
      };

      const response: AuthResponse = await authService.signIn(signInDto);

      expect(usersServiceFindByEmailSpy).toHaveBeenCalledTimes(1);
      expect(jwtSpy).toHaveBeenCalledTimes(2);

      expect(response).toBeDefined();
      expect(response.authToken).toBeDefined();
      expect(response.refreshToken).toBeDefined();
    });

    it('should throw exception when sign in with wrong password', async () => {
      const mockedUser = {
        email: 'test@email.com',
        password: 'wrong_password',
        firstName: 'Test',
        lastName: 'User',
        id: '1',
      };
      const usersServiceFindByEmailSpy = jest
        .spyOn(usersService, 'findByEmail')
        .mockImplementation(async () => mockedUser);

      const signInDto: SignInDto = {
        email: mockedUser.email,
        password: 'password',
      };

      authService
        .signIn(signInDto)
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
      const usersServiceFindByEmailSpy = jest.spyOn(
        usersService,
        'findByEmail',
      );
      authService
        .signIn(signInDto)
        .then(() => {
          fail('should throw exception');
        })
        .catch((exception) => {
          expect(usersServiceFindByEmailSpy).toHaveBeenCalledTimes(1);
          expect(exception).toBeInstanceOf(EmailNotFoundException);
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
      const usersServiceFindByEmailSpy = jest
        .spyOn(usersService, 'findByEmail')
        .mockImplementationOnce(async () => undefined)
        .mockImplementationOnce(async () => ({
          ...signUpDto,
          password: await bcrypt.hash('password', 10),
          id: '123',
        }));
      const usersServiceCreateUserSpy = jest
        .spyOn(usersService, 'createUser')
        .mockImplementation(async () => ({
          ...signUpDto,
          id: '123',
        }));
      const response: AuthResponse = await authService.signUp(signUpDto);

      expect(usersServiceCreateUserSpy).toHaveBeenCalledTimes(1);
      expect(usersServiceFindByEmailSpy).toHaveBeenCalledTimes(1);

      expect(response).toBeDefined();
      expect(response.authToken).toBeDefined();
      expect(response.refreshToken).toBeDefined();
      const user: User = await usersService.findByEmail(signUpDto.email);
      expect(user).toBeDefined();
      const passwordWasHashed: boolean = await bcrypt.compare(
        signUpDto.password,
        user.password,
      );
      expect(passwordWasHashed).toEqual(true);
    });

    it('should throw exception when sign up with existing email', async () => {
      const signUpDto: SignUpDto = {
        email: 'test@email.com',
        password: 'password',
        firstName: 'Test',
        lastName: 'User',
      };

      const usersServiceFindByEmailSpy = jest
        .spyOn(usersService, 'findByEmail')
        .mockImplementation(async () => ({
          email: 'test@email.com',
          password: 'password',
          firstName: 'Test',
          lastName: 'User',
          id: '1',
        }));
      const usersServiceCreateUserSpy = jest.spyOn(usersService, 'createUser');
      authService
        .signUp(signUpDto)
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
