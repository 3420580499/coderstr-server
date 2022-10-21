import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { throws } from 'assert';
import { NoPermissException } from 'Exception/NoPermissException';
import { Observable } from 'rxjs';

// 角色授权守卫

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // 通过反射获取定义在@SetMetadata('roles', ['admin'])上的权限数据
    const roles = this.reflector.get<string[]>('roles', context.getHandler()); //['admin']
    console.log(roles);
    if (roles.length === 0) {
      return true;
    }
    // 通过全局上下文对象context获取request对象
    const request = context.switchToHttp().getRequest(); //请求对象
    //根据参数中登录用户的角色信息判断是否能有权限调用此接口
    if (!request.user) {
      return false;
    }
    if (roles.includes(request.user.role)) {
      return true;
    }
    console.log(request.user.role);
    throw new NoPermissException('用户没有权限');
    return false;
  }
}
