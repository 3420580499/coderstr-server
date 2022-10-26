import { IStrategyOptions, Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { compareSync } from 'bcrypt';

// 本地登录策略

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'username',
      passwordField: 'password',
    } as IStrategyOptions);
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);
    console.log(user);
    if (!user) throw new HttpException('用户名不存在', HttpStatus.BAD_REQUEST);
    if (!compareSync(password, user.password)) {
      throw new HttpException('密码不正确', HttpStatus.BAD_REQUEST);
    }
    // 返回值放入req.user中
    return user;
  }
}
