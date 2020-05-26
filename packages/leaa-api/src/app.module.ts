import { Module, CacheModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { HttpCacheInterceptor } from '@leaa/api/src/interceptors';

import { TypeormService } from '@leaa/api/src/modules/v1/typeorm/typeorm.service';
import { SeedModule } from '@leaa/api/src/modules/v1/seed/seed.module';
import { ConfigModule } from '@leaa/api/src/modules/v1/config/config.module';
import { PlaygroundModule } from '@leaa/api/src/modules/v1/playground/playground.module';
//
import { AuthModule } from '@leaa/api/src/modules/v1/auth/auth.module';
import { ActionModule } from '@leaa/api/src/modules/v1/action/action.module';
import { UserModule } from '@leaa/api/src/modules/v1/user/user.module';
import { RoleModule } from '@leaa/api/src/modules/v1/role/role.module';
import { PermissionModule } from '@leaa/api/src/modules/v1/permission/permission.module';
//
import { TestModule } from '@leaa/api/src/modules/v1/test/test.module';
import { IndexModule } from '@leaa/api/src/modules/v1/index/index.module';
import { TagModule } from '@leaa/api/src/modules/v1/tag/tag.module';
import { CategoryModule } from '@leaa/api/src/modules/v1/category/category.module';
import { AttachmentModule } from '@leaa/api/src/modules/v1/attachment/attachment.module';
import { ConfigService } from '@leaa/api/src/modules/v1/config/config.service';

const imports = [
  CacheModule.register(),
  TypeOrmModule.forRootAsync({
    inject: [ConfigService],
    useClass: TypeormService,
  }),
  SeedModule,
  ConfigModule,
  PlaygroundModule,
  //
  AuthModule,
  ActionModule,
  UserModule,
  RoleModule,
  PermissionModule,
  //
  TestModule,
  IndexModule,
  TagModule,
  CategoryModule,
  AttachmentModule,
];

@Module({
  imports,
  providers: [
    AuthModule,
    UserModule,
    ConfigModule,
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpCacheInterceptor,
    },
  ],
  controllers: [],
})
export class AppModule {}
