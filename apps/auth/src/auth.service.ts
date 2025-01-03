import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersDocument } from '@app/common';
import { TokenPayload } from './interfaces/users.interfaces';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async login(user: UsersDocument, response: Response) {
    try {
      const tokenPayload: TokenPayload = {
        userId: user._id.toHexString(),
      };

      const expires = new Date();
      expires.setSeconds(
        expires.getSeconds() + this.configService.get('JWT_EXPIRATION'),
      );

      const token = this.jwtService.sign(tokenPayload);

      response.cookie('Authentication', token, {
        httpOnly: true,
        expires,
      });
    } catch (error) {
      throw new InternalServerErrorException('failed to sign in');
    }
  }
}
