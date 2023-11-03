import { Injectable } from '@nestjs/common';
import { UserDto } from './userDto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async create(user: UserDto): Promise<string> {
    try {
      await this.userRepository.save(user);
      return 'User created successfully';
    } catch (err) {
      console.log(err);
    }
  }
}
