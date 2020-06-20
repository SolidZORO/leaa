import _ from 'lodash';
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { logger } from '@leaa/api/src/utils';

export interface IHttpException {
  statusCode: number;
  message: string;
  lang: string;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter<unknown> {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    const req = ctx.getRequest();

    const statusCode = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const lang = req.language || '';

    let message = statusCode >= 500 ? 'Server Error' : 'Kernel Panic!';

    if (exception instanceof HttpException) message = exception?.message;

    // @ts-ignore
    // e.g. `Duplicate entry 'EMPTY' for key 'IDX_d90243459a697eadb8ad56e909'`
    if (exception?.sqlMessage && `${exception?.sqlMessage}`.includes('Duplicate entry')) message = 'Duplicate Entry';

    // File log & Cli log
    logger.error(`${exception}` || 'HttpExceptionFilter ErrorMsg');
    console.error(
      '\n---- EXCEPTION ----\n',
      // @ts-ignore
      `\nSQL:\n ${exception.sqlMessage}`,
      // @ts-ignore
      `\n\nRES:\n ${exception.response}\n\n\n\n`,
    );

    res.status(statusCode).json({
      statusCode,
      message,
      lang,
    });
  }
}
