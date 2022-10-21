import { SetMetadata } from '@nestjs/common';

// 自定义装饰器Role (扩展SetMetadata)
export const Role = (...args: string[]) => SetMetadata('roles', args);
