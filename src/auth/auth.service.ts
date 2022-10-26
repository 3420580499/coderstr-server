import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CacheService } from 'src/cache/cache.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly cacheService: CacheService,
  ) {}

  async validateUser(username, password) {
    const user = await this.userService.login(username, password);
    return user;
  }

  // 生成token
  createToken(user) {
    return this.jwtService.sign(user);
  }

  async login(user) {
    const token = this.createToken({
      id: user.id,
      username: user.username,
      role: user.role,
    });
    // 用户在远程一次登录后，redis存取对应token，如果另一方登录，覆盖掉这个token，原来的token就无效的
    // 我们可以在jwt策略中判断用户传过来的token和redis中存的token是否一致，不一致则代表异地登录了（原先登录无效，得重新登录）
    // 在jwt中第一次登录用户拿到的token依然是有效的，但是存在异地登录，我们得主动去抛出重新登录异常（见jwt策略验证类）
    this.cacheService.set(user.id, token, 24 * 60 * 3600);
    return { token };
  }
}
