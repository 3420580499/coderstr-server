import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';

import { resolve } from 'path';
import { readFileSync } from 'fs';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('publickey'),
      algorithms: ['RS256'],
    });
  }

  async validate(payload: any) {
    const user = await this.userService.getUser(payload);
    if (!user) {
      throw new HttpException('token不正确', HttpStatus.BAD_REQUEST);
    }
    // 返回值放入req.user中
    return user;
    // return { id: payload.id, username: payload.username, role: payload.role };
  }
}
