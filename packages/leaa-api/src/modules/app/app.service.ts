import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  private logger: Logger;

  constructor() {
    this.logger = new Logger(this.constructor.name);
  }

  getHello(): string {
    const helloString = 'Hello Jason!';

    try {
      this.logger.error(helloString);
    } catch (e) {
      this.logger.error(e.message);
    }

    return helloString;
  }
}
