import _ from 'lodash';
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
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    const req = ctx.getRequest();

    const statusCode = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const lang = req.language || '';

    let message = statusCode >= 500 ? 'Http Server Error' : 'Kernel Panic!';

    if (exception instanceof HttpException)
      message =
        // @ts-ignore
        (_.isArray(exception.response?.message) ? exception.response?.message[0] : exception.response?.message) ||
        exception.message;

    logger.error(`${exception}` || 'HttpExceptionFilter ErrorMsg');

    // @ts-ignore
    console.error('\n\n---- EXCEPTION-SQL-MESSAGE ----\n', exception.sqlMessage);

    // @ts-ignore
    console.error('\n\n---- EXCEPTION-RESPONSE ----\n', exception.response);

    res.status(statusCode).json({
      statusCode,
      message,
      lang,
    });
  }
}
