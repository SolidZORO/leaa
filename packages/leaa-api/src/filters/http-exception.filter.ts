import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

export interface IHttpException {
  statusCode: number;
  message: string;
  lang: string;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    const req = ctx.getRequest();

    const statusCode = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const lang = req.language || '';

    // @ts-ignore
    let message = exception?.sqlMessage || exception?.message || 'KERNEL PANIC!!!';

    if (exception instanceof HttpException) {
      message = exception.message;
    }

    res.status(statusCode).json({
      statusCode,
      message,
      lang,
    });
  }
}
