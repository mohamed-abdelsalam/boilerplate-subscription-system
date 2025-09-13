import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user';
import { Repository } from 'typeorm';

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should create new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test-email@test.com',
        firstName: 'Test',
        lastName: 'User',
        password: '1234',
      };

      const createSpy = jest.spyOn(usersRepository, 'create').mockReturnValue({
        id: '123',
        email: 'test-email@test.com',
        firstName: 'Test',
        lastName: 'User',
        password: '1234',
      });

      const saveSpy = jest
        .spyOn(usersRepository, 'save')
        .mockImplementation(async () => ({
          id: '123',
          email: 'test-email@test.com',
          firstName: 'Test',
          lastName: 'User',
          password: '1234',
        }));

      const newUser: User = await service.createUser(createUserDto);

      expect(newUser.id).toBeDefined();
      expect(newUser.email).toEqual(createUserDto.email);
      expect(newUser.firstName).toEqual(createUserDto.firstName);
      expect(newUser.lastName).toEqual(createUserDto.lastName);
      expect(newUser.password).toEqual(createUserDto.password);
      expect(createSpy).toHaveBeenCalledTimes(1);
      expect(saveSpy).toHaveBeenCalledWith({ ...createUserDto, id: '123' });
    });
  });

  describe('findByEmail', () => {
    it('should find user by email', async () => {
      const email: string = 'test-email@test.com';
      usersRepository.findOneBy = jest.fn().mockReturnValue({
        id: '123',
        email: 'test-email@test.com',
        firstName: 'Test',
        lastName: 'User',
        password: '1234',
      });
      const findByOneSpy = jest.spyOn(usersRepository, 'findOneBy');

      const user: User = await service.findByEmail(email);

      expect(user.email).toEqual(email);
      expect(findByOneSpy).toHaveBeenCalledWith({ email });
      expect(findByOneSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('findById', () => {
    it('should find user by id', async () => {
      const id: string = '123';
      usersRepository.findOneBy = jest.fn().mockReturnValue({
        id: '123',
        email: 'test-email@test.com',
        firstName: 'Test',
        lastName: 'User',
        password: '1234',
      });
      const findByOneSpy = jest.spyOn(usersRepository, 'findOneBy');

      const user: User = await service.findById(id);

      expect(user.id).toEqual(id);
      expect(findByOneSpy).toHaveBeenCalledWith({ id });
      expect(findByOneSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getUserName', () => {
    it('should find user full name', async () => {
      const id: string = '123';
      usersRepository.findOneBy = jest.fn().mockReturnValue({
        id: '123',
        email: 'test-email@test.com',
        firstName: 'Test',
        lastName: 'User',
        password: '1234',
      });
      const findByOneSpy = jest.spyOn(usersRepository, 'findOneBy');

      const userFullName: string = await service.getUserFullName(id);

      expect(userFullName).toEqual('Test User');
      expect(findByOneSpy).toHaveBeenCalledWith({ id });
      expect(findByOneSpy).toHaveBeenCalledTimes(1);
    });

    it('should return null if the user is not there', async () => {
      const id: string = '123';
      usersRepository.findOneBy = jest.fn().mockReturnValue(undefined);
      const findByOneSpy = jest.spyOn(usersRepository, 'findOneBy');

      const userFullName: string = await service.getUserFullName(id);

      expect(userFullName).toEqual(null);
      expect(findByOneSpy).toHaveBeenCalledWith({ id });
    });
  });
});
