import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should create new user', () => {
      const createUserDto: CreateUserDto = {
        email: 'test-email@test.com',
        firstName: 'Test',
        lastName: 'User',
        password: '1234',
      };

      const newUser = service.createUser(createUserDto);

      expect(newUser.id).toBeDefined();
      console.log(newUser.id);
      expect(newUser.email).toEqual(createUserDto.email);
      expect(newUser.firstName).toEqual(createUserDto.firstName);
      expect(newUser.lastName).toEqual(createUserDto.lastName);
      expect(newUser.password).toEqual(createUserDto.password);
    });

    it('should create new user', () => {
      const createUserDto: CreateUserDto = {
        email: 'test-email@test.com',
        firstName: 'Test',
        lastName: 'User',
        password: '1234',
      };

      const newUser = service.createUser(createUserDto);

      expect(newUser.email).toEqual(createUserDto.email);
      expect(newUser.firstName).toEqual(createUserDto.firstName);
      expect(newUser.lastName).toEqual(createUserDto.lastName);
      expect(newUser.password).toEqual(createUserDto.password);
    });
  });
});
