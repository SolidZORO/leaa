import { Module, CacheModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core';
// import { GraphQLModule } from '@nestjs/graphql';

import { HttpCacheInterceptor } from '@leaa/api/src/interceptors';

// import { GraphqlService } from '@leaa/api/src/modules/graphql/graphql.service';
import { TypeormService } from '@leaa/api/src/modules/typeorm/typeorm.service';

import { ConfigModule, envConfig } from '@leaa/api/src/modules/config/config.module';
import { SeedModule } from '@leaa/api/src/modules/seed/seed.module';
import { PlaygroundModule } from '@leaa/api/src/modules/playground/playground.module';
import { IndexModule } from '@leaa/api/src/modules/index/index.module';
//
// import { CompanyModule } from '@leaa/api/src/modules/ax/ax.module';
import { UserModule } from '@leaa/api/src/modules/user/user.module';
import { AuthModule } from '@leaa/api/src/modules/auth/auth.module';
import { RoleModule } from '@leaa/api/src/modules/role/role.module';
import { CategoryModule } from '@leaa/api/src/modules/category/category.module';
// import { AuthTokenModule } from '@leaa/api/src/modules/auth-token/auth-token.module';
// import { AttachmentModule } from '@leaa/api/src/modules/attachment/attachment.module';
import { PermissionModule } from '@leaa/api/src/modules/permission/permission.module';
// import { SettingModule } from '@leaa/api/src/modules/setting/setting.module';
import { TagModule } from '@leaa/api/src/modules/tag/tag.module';
// import { CouponModule } from '@leaa/api/src/modules/coupon/coupon.module';
// import { PromoModule } from '@leaa/api/src/modules/promo/promo.module';
// import { ProductModule } from '@leaa/api/src/modules/product/product.module';
// import { AddressModule } from '@leaa/api/src/modules/address/address.module';
// import { DivisionModule } from '@leaa/api/src/modules/division/division.module';
// import { ExportModule } from '@leaa/api/src/modules/export/export.module';
// import { ZanModule } from '@leaa/api/src/modules/zan/zan.module';
import { DemoModule } from '@leaa/api/src/modules/demo/demo.module';
import { TestModule } from '@leaa/api/src/modules/test/test.module';
import { ActionModule } from '@leaa/api/src/modules/action/action.module';
import { CompanyModule } from '@leaa/api/src/modules/company/company.module';

const imports = [
  CacheModule.register(),
  TypeOrmModule.forRootAsync({
    useClass: TypeormService,
  }),
  // GraphQLModule.forRootAsync({
  //   imports: [AuthModule],
  //   useClass: GraphqlService,
  // }),
  ConfigModule,
  SeedModule,
  PlaygroundModule,
  IndexModule,
  //
  AuthModule,
  UserModule,
  PermissionModule,
  RoleModule,
  CategoryModule,
  ActionModule,
  // AttachmentModule,
  // CompanyModule,
  // AuthTokenModule,
  // SettingModule,
  TagModule,
  // CouponModule,
  // PromoModule,
  // ProductModule,
  // AddressModule,
  // DivisionModule,
  // ExportModule,
  // ZanModule,
  TestModule,
  // I18nModule,
  ActionModule,
  CompanyModule,
];

if (envConfig.DEMO_MODE) {
  imports.push(DemoModule);
}

@Module({
  imports,
  providers: [
    ConfigModule,
    AuthModule,
    UserModule,
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpCacheInterceptor,
    },
  ],
  controllers: [],
})
export class AppModule {}
