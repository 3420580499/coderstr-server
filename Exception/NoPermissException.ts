import { HttpException } from '@nestjs/common';

// 权限不足
export class NoPermissException extends HttpException {
  constructor(response: string | Record<string, any>) {
    super(response, 401);
  }
}
