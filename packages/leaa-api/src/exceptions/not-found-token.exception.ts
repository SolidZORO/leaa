import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundTokenException extends HttpException {
  /**
   * @param objectOrError string or object describing the error condition.
   * @param description a short description of the HTTP error.
   */
  constructor(objectOrError?: string | Record<string, unknown> | any, description = 'Not Found Token') {
    super(HttpException.createBody(objectOrError, description, HttpStatus.NOT_FOUND), HttpStatus.NOT_FOUND);
  }
}
