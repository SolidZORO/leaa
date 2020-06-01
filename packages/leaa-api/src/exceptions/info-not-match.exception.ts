import { HttpException, HttpStatus } from '@nestjs/common';

export class InfoNotMatchException extends HttpException {
  /**
   * @param objectOrError string or object describing the error condition.
   * @param description a short description of the HTTP error.
   */
  constructor(objectOrError?: string | object | any, description = 'Info Not Match') {
    super(HttpException.createBody(objectOrError, description, HttpStatus.FORBIDDEN), HttpStatus.FORBIDDEN);
  }
}
