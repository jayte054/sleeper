import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto, GetUserDto } from '../dto/createUserDto.dto';
import { UsersRepository } from './users.repository';
import { UsersDocument } from '@app/common';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UsersRepository) {}

  createUser = async (createUserDto: CreateUserDto) => {
    await this.validateCreateUserDto(createUserDto);
    return await this.userRepository.create({
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 11),
    });
  };

  private async validateCreateUserDto(createUserDto: CreateUserDto) {
    try {
      await this.userRepository.findOne({ email: createUserDto.email });
    } catch (error) {
      return;
    }
    throw new UnprocessableEntityException('Email already exists');
  }

  verifyUser = async (email: string, password: string) => {
    try {
      const user = await this.userRepository.findOne({ email });
      const passwordIsValid = await bcrypt.compare(password, user.password);

      if (!passwordIsValid) {
        throw new UnauthorizedException('invalid credentials');
      }

      return user;
    } catch (error) {
      throw new InternalServerErrorException('failed to verify user');
    }
  };

  getUser = async (getUserDto: GetUserDto) => {
    try {
      const user = this.userRepository.findOne({ _id: getUserDto._id });
      return user;
    } catch (error) {
      console.log(error);
    }
  };

  getUsers = async (): Promise<UsersDocument[]> => {
    return await this.userRepository.find({});
  };
}
