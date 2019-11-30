import { Logger as NestLogger, LoggerService as NestLoggerService } from '@nestjs/common';
import { loggerUtil } from '@leaa/api/src/utils';

export class LoggerService extends NestLogger implements NestLoggerService {
  log(message: string, context?: string) {
    super.log(message, context);
    loggerUtil.log(message, context);
  }

  error(message: string, trace: string, context?: string) {
    super.error(message, trace, context);
    loggerUtil.error(message, trace, context);
  }

  warn(message: string, context?: string) {
    super.warn(message, context);
    loggerUtil.warn(message, context);
  }

  debug(message: string, context?: string) {
    super.debug(message, context);
    loggerUtil.debug(message, context);
  }

  verbose(message: string, context?: string) {
    super.verbose(message, context);
    loggerUtil.verbose(message, context);
  }
}
