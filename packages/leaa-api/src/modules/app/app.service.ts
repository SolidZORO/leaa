import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  private logger: Logger;

  constructor() {
    this.logger = new Logger(this.constructor.name);
  }

  getHello(): string {
    const helloString = 'Hello Jason and Logger!';

    this.logger.log(helloString);

    return helloString;
  }
}
