import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundUserException extends HttpException {
  /**
   * @param objectOrError string or object describing the error condition.
   * @param description a short description of the HTTP error.
   */
  constructor(objectOrError?: string | object | any, description = 'Not Found User') {
    super(HttpException.createBody(objectOrError, description, HttpStatus.NOT_FOUND), HttpStatus.NOT_FOUND);
  }
}
