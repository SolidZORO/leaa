import { Injectable, Logger } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

import { User, Permission, Role, Category, Article, Attachment } from '@leaa/common/entrys';
import { ConfigService } from '@leaa/api/modules/config/config.service';

const CONSTRUCTOR_NAME = 'TypeormService';

@Injectable()
export class TypeormService implements TypeOrmOptionsFactory {
  private logger: Logger;

  constructor(readonly configService: ConfigService) {
    this.logger = new Logger(CONSTRUCTOR_NAME);
  }

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      connectTimeout: 10000,
      acquireTimeout: 10000,
      host: this.configService.MYSQL_HOST,
      port: this.configService.MYSQL_PORT,
      username: this.configService.MYSQL_USER,
      password: this.configService.MYSQL_PASSWORD,
      database: this.configService.MYSQL_DATABASE,
      // synchronize: false,
      synchronize: true,
      logging: true,
      charset: 'utf8mb4',
      entities: [
        // `${__dirname}/**/*.entity{.js,.ts}`,
        //
        // for @zeit/ncc import
        User,
        Permission,
        Role,
        Category,
        Article,
        Attachment,
      ],
    };
  }
}
