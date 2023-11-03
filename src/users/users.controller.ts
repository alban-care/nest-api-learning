import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './userDto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/')
  findAll(): any[] {
    return this.usersService.findAll();
  }

  @Post()
  create(@Body() user: UserDto): any {
    return this.usersService.create(user);
  }
}
