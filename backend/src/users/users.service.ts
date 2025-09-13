import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}
  public createUser(createUserDto: CreateUserDto): Promise<User> {
    const user: User = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  public async findByEmail(email: string): Promise<User> {
    return this.usersRepository.findOneBy({ email });
  }

  public async findById(id: string): Promise<User> {
    return this.usersRepository.findOneBy({ id });
  }

  public async getUserFullName(id: string): Promise<string> {
    const user: User = await this.findById(id);
    if (user) {
      return `${user.firstName} ${user.lastName}`;
    }
    return null;
  }
}
