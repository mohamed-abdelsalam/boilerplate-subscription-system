import { v4 as uuidv4 } from 'uuid';

import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user';

const userList: User[] = [];

@Injectable()
export class UsersService {
  public createUser(createUserDto: CreateUserDto): any {
    userList.push({
      email: createUserDto.email,
      password: createUserDto.password,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      id: uuidv4(),
    });
    return userList[userList.length - 1];
  }

  public findByEmail(email: string): User {
    return userList.filter((i) => {
      return i.email === email;
    })[0];
  }
}
