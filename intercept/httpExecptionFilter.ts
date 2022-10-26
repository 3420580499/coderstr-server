import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

// 全局异常过滤器
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    console.log('异常过滤器执行');
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const message = exception.getResponse();

    // 不管是代码直接抛出异常还是在管道验证类中抛出的异常，都会来到这里
    // 将管道验证类抛出的异常格式 来统一处理一下
    console.log(message);
    if (typeof message === 'string') {
      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        error: message,
        success: 'false',
      });
    } else {
      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        error:
          typeof message['message'] === 'string'
            ? message['message']
            : [...message['message']],
        success: 'false',
      });
    }
    // 还有一个要注意的：当token过期或者token错误，登录传参的参数是不是local策略中规定的username和password时
    //内部抛出异常 ：{status:400,error:'Unauthorized'}  //这个异常没法直接去捕获！！！
  }
}
