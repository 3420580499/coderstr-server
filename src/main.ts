import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

import envConfig from '../environment/getEnvironmentCofing';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(envConfig().PORT, () => {
    // 打印启动日志
    Logger.log(`server open in localhost:${envConfig().PORT}`);
  });
}
bootstrap();

console.log('dev branch create');
