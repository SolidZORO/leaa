import { Injectable, Logger } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

import { User, Permission, Role } from '@leaa/common/entrys';
import { ConfigService } from '@leaa/api/modules/config/config.service';

@Injectable()
export class TypeormService implements TypeOrmOptionsFactory {
  private logger: Logger;

  constructor(readonly config: ConfigService) {
    this.logger = new Logger(this.constructor.name);
  }

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      connectTimeout: 10000,
      acquireTimeout: 10000,
      host: this.config.MYSQL_HOST,
      port: this.config.MYSQL_PORT,
      username: this.config.MYSQL_USER,
      password: this.config.MYSQL_PASSWORD,
      database: this.config.MYSQL_DATABASE,
      // synchronize: false,
      synchronize: true,
      logging: true,
      entities: [
        // `${__dirname}/**/*.entity{.js,.ts}`,
        //
        // for @zeit/ncc import
        User,
        Permission,
        Role,
      ],
    };
  }
}
