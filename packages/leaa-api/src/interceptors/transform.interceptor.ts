import { Injectable, HttpException, NestInterceptor, CallHandler, ExecutionContext, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  // constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
    const call$ = next.handle();

    return call$.pipe(
      catchError((error: any): any => {
        if (error instanceof HttpException) {
          return Promise.resolve({
            code: error.getStatus(),
            message: error.getResponse(),
          });
        }

        if (error.code && error.details) {
          return Promise.resolve({
            code: error.code,
            message: error.details,
          });
        }
      }),
    );
  }
}
