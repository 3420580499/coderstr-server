import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {
  Catch,
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';

import { resolve } from 'path';
import { readFileSync } from 'fs';
import { Request } from 'express';
import { CacheService } from 'src/cache/cache.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly cacheService: CacheService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('publickey'),
      algorithms: ['RS256'],
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any, done: any) {
    // 获取用户这次登录的token（已经有jwt验证通过了）
    const originToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    console.log(originToken);
    // 交给redis进行验证
    const realToken = await this.cacheService.get(payload.id);
    console.log(realToken);
    if (realToken !== originToken) {
      throw new HttpException(
        '你的账户在远程登录了，请重新登录',
        HttpStatus.BAD_REQUEST,
      );
    }
    // console.log(originToken);
    console.log(done);
    console.log(payload);
    console.log('====');
    const user = await this.userService.getUser(payload);
    if (!user) {
      throw new HttpException('token不正确', HttpStatus.BAD_REQUEST);
    }
    // 返回值放入req.user中
    return user;
    // return { id: payload.id, username: payload.username, role: payload.role };
  }
}
