import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { logger } from '@leaa/api/src/utils';

export interface IHttpException {
  statusCode: number;
  message: string;
  lang: string;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const __DEV__ = process.env.NODE_ENV !== 'production';

    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    const req = ctx.getRequest();

    const statusCode = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const lang = req.language || '';

    // @ts-ignore
    // let message = (__DEV__ && exception?.sqlMessage) || exception?.message || 'KERNEL PANIC!';

    // @ts-ignore
    let message = statusCode >= 500 ? 'SERVER ERROR' : (__DEV__ && exception?.message) || 'KERNEL PANIC!';

    // @ts-ignore
    if (__DEV__ && exception?.sqlMessage) message = exception?.sqlMessage;
    if (exception instanceof HttpException) message = exception.message;

    logger.error(`${exception}` || 'HttpExceptionFilter ErrorMsg');
    console.log(exception);

    res.status(statusCode).json({
      statusCode,
      message,
      lang,
    });
  }
}
