import { Injectable, Logger } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

import {
  User,
  Permission,
  Role,
  Category,
  Article,
  Attachment,
  Ax,
  Setting,
  Auth,
  Tag,
  Coupon,
  Promo,
  Product,
  Address,
  Division,
  Zan,
  Verification,
  Action,
} from '@leaa/common/src/entrys';

import { TagSubscriber, AttachmentSubscriber, UserSubscriber } from '@leaa/api/src/subscribers';
import { ConfigService } from '@leaa/api/src/modules/config/config.service';

const CLS_NAME = 'TypeormService';

@Injectable()
export class TypeormService implements TypeOrmOptionsFactory {
  private logger: Logger;

  constructor(readonly configService: ConfigService) {
    this.logger = new Logger(CLS_NAME);
  }

  createTypeOrmOptions(): TypeOrmModuleOptions {
    let options: TypeOrmModuleOptions = {
      host: this.configService.DB_HOST,
      port: this.configService.DB_PORT,
      username: this.configService.DB_USER,
      password: this.configService.DB_PASSWORD,
      database: this.configService.DB_DATABASE,
      synchronize: this.configService.DB_SYNCHRONIZE,
      logging: process.env.NODE_ENV !== 'production',
      entities: [
        // `${__dirname}/**/*.entity{.js,.ts}`,
        //
        // for @zeit/ncc import
        Auth,
        User,
        Permission,
        Role,
        Category,
        Article,
        Attachment,
        Ax,
        Setting,
        Tag,
        Coupon,
        Promo,
        Product,
        Address,
        Division,
        Zan,
        Verification,
        Action,
      ],
      subscribers: [TagSubscriber, AttachmentSubscriber, UserSubscriber],
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
          // fix local and server timeone out of sync
          // dateStrings: true,
          // timezone: 'Z',
        },
      };
    }

    return options;
  }
}
