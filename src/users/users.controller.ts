import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './userDto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/')
  async findAll() {
    return await this.usersService.findAll();
  }

  @Post('/')
  async create(@Body() user: UserDto) {
    return await this.usersService.create(user);
  }
}
