import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { CreateUserDto } from '../dto/createUserDto.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../current-user.decorator';
import { UsersDocument } from '../models/user.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('createUser')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.createUser(createUserDto);
  }

  @Get('/user')
  @UseGuards(JwtAuthGuard)
  async getUser(@CurrentUser() user: UsersDocument) {
    return user;
  }

  @Get('/users')
  @UseGuards(JwtAuthGuard)
  async getUsers() {
    return await this.usersService.getUsers();
  }
}
