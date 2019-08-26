import { Injectable, Logger } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

import { User, Permission, Role, Category, Article, Attachment, Ax, Setting, Oauth } from '@leaa/common/src/entrys';
import { ConfigService } from '@leaa/api/src/modules/config/config.service';

const CONSTRUCTOR_NAME = 'TypeormService';

@Injectable()
export class TypeormService implements TypeOrmOptionsFactory {
  private logger: Logger;

  constructor(readonly configService: ConfigService) {
    this.logger = new Logger(CONSTRUCTOR_NAME);
  }

  createTypeOrmOptions(): TypeOrmModuleOptions {
    let options: TypeOrmModuleOptions = {
      host: this.configService.DB_HOST,
      port: this.configService.DB_PORT,
      username: this.configService.DB_USER,
      password: this.configService.DB_PASSWORD,
      database: this.configService.DB_DATABASE,
      synchronize: true,
      logging: process.env.NODE_ENV !== 'production',
      entities: [
        // `${__dirname}/**/*.entity{.js,.ts}`,
        //
        // for @zeit/ncc import
        Oauth,
        User,
        Permission,
        Role,
        Category,
        Article,
        Attachment,
        Ax,
        Setting,
      ],
    };

    if (this.configService.DB_TYPE === 'mysql') {
      options = {
        ...options,
        ...{
          type: 'mysql',
          charset: 'utf8mb4',
          collation: 'utf8mb4_unicode_ci',
          // https://stackoverflow.com/questions/35553432/error-handshake-inactivity-timeout-in-node-js-mysql-module
          keepConnectionAlive: true,
          acquireTimeout: 20 * 1000, // 20s
        },
      };
    }

    if (this.configService.DB_TYPE === 'postgres') {
      options = {
        ...options,
        ...{
          type: 'postgres',
          // retryAttempts: 10,
        },
      };
    }

    return options;
  }
}
