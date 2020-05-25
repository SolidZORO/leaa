import { Module, CacheModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { HttpCacheInterceptor } from '@leaa/api/src/interceptors';

import { SeedModule } from '@leaa/api/src/modules/seed/seed.module';
import { DemoModule } from '@leaa/api/src/modules/demo/demo.module';
import { IndexModule } from '@leaa/api/src/modules/index/index.module';
import { TypeormService } from '@leaa/api/src/modules/typeorm/typeorm.service';
import { ConfigModule, envConfig } from '@leaa/api/src/modules/config/config.module';
import { PlaygroundModule } from '@leaa/api/src/modules/playground/playground.module';
//
import { TagModule } from '@leaa/api/src/modules/tag/tag.module';
import { TestModule } from '@leaa/api/src/modules/test/test.module';
import { UserModule } from '@leaa/api/src/modules/user/user.module';
import { AuthModule } from '@leaa/api/src/modules/auth/auth.module';
import { RoleModule } from '@leaa/api/src/modules/role/role.module';
import { ActionModule } from '@leaa/api/src/modules/action/action.module';
import { CategoryModule } from '@leaa/api/src/modules/category/category.module';
import { PermissionModule } from '@leaa/api/src/modules/permission/permission.module';

const imports = [
  TypeOrmModule.forRootAsync({
    useClass: TypeormService,
  }),
  CacheModule.register(),
  SeedModule,
  IndexModule,
  ConfigModule,
  PlaygroundModule,
  //
  TagModule,
  AuthModule,
  UserModule,
  RoleModule,
  TestModule,
  ActionModule,
  ActionModule,
  CategoryModule,
  PermissionModule,
];

if (envConfig.DEMO_MODE) {
  imports.push(DemoModule);
}

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
