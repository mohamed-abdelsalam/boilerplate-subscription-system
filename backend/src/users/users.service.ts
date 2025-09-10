import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

const userList: any[] = [];

@Injectable()
export class UsersService {
  public createUser(createUserDto: CreateUserDto): any {
    userList.push({
      email: createUserDto.email,
      password: createUserDto.password,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      id: userList.length + 1,
    });
    return userList[userList.length - 1];
  }

  public findByEmail(email: string): any {
    return userList.filter((i) => {
      return i.email === email;
    })[0];
  }
}
