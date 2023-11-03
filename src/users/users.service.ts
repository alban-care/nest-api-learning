import { Injectable } from '@nestjs/common';
import { UserDto } from './userDto';

@Injectable()
export class UsersService {
  private readonly users: UserDto[] = [];

  create(user: UserDto): UserDto {
    this.users.push(user);
    return user;
  }

  findAll(): UserDto[] {
    return this.users;
  }
}
