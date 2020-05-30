import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IResponse, IRequest } from '@leaa/api/src/interfaces';

export interface IHttpData<T> {
  statusCode: number;
  message: string;
  data: T;
  lang: string;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, IHttpData<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<IHttpData<T>> {
    const ctx = context.switchToHttp();
    const res: IResponse = ctx.getResponse();
    const req: IRequest = ctx.getRequest();

    const ignoreList = ['/'];

    // ignore index
    if (ignoreList.includes(req.route.path)) return next.handle();

    const statusCode = res.statusCode || HttpStatus.OK;
    const message = 'Success';
    const lang = req.language || '';

    return next.handle().pipe(
      map((data) => ({
        statusCode,
        message,
        lang,
        data,
      })),
    );
  }
}
