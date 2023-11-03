import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { UserDto } from '../dto/userDto';

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
