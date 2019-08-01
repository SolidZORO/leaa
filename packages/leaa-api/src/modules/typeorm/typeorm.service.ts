import { Injectable, Logger } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

import { User, Permission, Role, Category, Article, Attachment, Ax } from '@leaa/common/entrys';
import { ConfigService } from '@leaa/api/modules/config/config.service';

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
        User,
        Permission,
        Role,
        Category,
        Article,
        Attachment,
        Ax,
      ],
    };

    if (this.configService.DB_TYPE === 'mysql') {
      options = {
        ...options,
        ...{
          type: 'mysql',
          charset: 'utf8mb4',
          // connectTimeout: 10000,
          // acquireTimeout: 10000,
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
