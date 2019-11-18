import { Module, CacheModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';

import { GraphqlService } from '@leaa/api/src/modules/graphql/graphql.service';
import { TypeormService } from '@leaa/api/src/modules/typeorm/typeorm.service';

import { ConfigModule } from '@leaa/api/src/modules/config/config.module';
import { SeedModule } from '@leaa/api/src/modules/seed/seed.module';
import { PlaygroundModule } from '@leaa/api/src/modules/playground/playground.module';
import { IndexModule } from '@leaa/api/src/modules/index/index.module';
//
import { AxModule } from '@leaa/api/src/modules/ax/ax.module';
import { UserModule } from '@leaa/api/src/modules/user/user.module';
import { AuthModule } from '@leaa/api/src/modules/auth/auth.module';
import { RoleModule } from '@leaa/api/src/modules/role/role.module';
import { CategoryModule } from '@leaa/api/src/modules/category/category.module';
import { ArticleModule } from '@leaa/api/src/modules/article/article.module';
import { AuthTokenModule } from '@leaa/api/src/modules/auth-token/auth-token.module';
import { AttachmentModule } from '@leaa/api/src/modules/attachment/attachment.module';
import { PermissionModule } from '@leaa/api/src/modules/permission/permission.module';
import { SettingModule } from '@leaa/api/src/modules/setting/setting.module';
import { OauthModule } from '@leaa/api/src/modules/oauth/oauth.module';
import { TagModule } from '@leaa/api/src/modules/tag/tag.module';
import { CouponModule } from '@leaa/api/src/modules/coupon/coupon.module';

@Module({
  imports: [
    CacheModule.register(),
    TypeOrmModule.forRootAsync({
      useClass: TypeormService,
    }),
    GraphQLModule.forRootAsync({
      imports: [AuthModule],
      useClass: GraphqlService,
    }),
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
    ArticleModule,
    AttachmentModule,
    AxModule,
    AuthTokenModule,
    SettingModule,
    OauthModule,
    TagModule,
    CouponModule,
  ],
  providers: [ConfigModule, AuthModule, UserModule],
  controllers: [],
})
export class AppModule {}
