import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

import envConfig from '../environment/getEnvironmentCofing';
import { ResponseInterceptor } from '../intercept/globalResponseIntercept';
import { HttpExceptionFilter } from '../intercept/httpExecptionFilter';
import { resolve } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  app.useStaticAssets(resolve(__dirname, './images'), {
    prefix: '/static',
  });
  await app.listen(envConfig().PORT, () => {
    // 打印启动日志
    Logger.log(`server open in localhost:${envConfig().PORT}`);
  });
}
bootstrap();

console.log('dev branch create');
