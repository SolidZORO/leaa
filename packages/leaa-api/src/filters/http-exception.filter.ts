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

    let consoleLog = '\n\n\n---- EXCEPTION ----\n\n';

    // @ts-ignore
    if (exception?.sqlMessage) consoleLog += `\nSQL: ${JSON.stringify(exception.sqlMessage)}\n\n`;

    // @ts-ignore
    if (exception?.response) consoleLog += `\nRES: ${JSON.stringify(exception.response)}\n\n`;

    consoleLog += `\nRAW: ${JSON.stringify(exception)}\n\n`;
    console.error(consoleLog);

    // File log & Cli log
    logger.error(JSON.stringify(exception) || 'HttpExceptionFilter ErrorMsg');

    res.status(statusCode).json({
      statusCode,
      message,
      lang,
    });
  }
}
