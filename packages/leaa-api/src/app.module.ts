import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';

import { GraphqlService } from './modules/graphql/graphql.service';
import { TypeormService } from './modules/typeorm/typeorm.service';

import { ConfigModule } from './modules/config/config.module';
import { SeedModule } from './modules/seed/seed.module';
import { PlaygroundModule } from './modules/playground/playground.module';
import { IndexModule } from './modules/index/index.module';
//
import { AxModule } from './modules/ax/ax.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { RoleModule } from './modules/role/role.module';
import { CategoryModule } from './modules/category/category.module';
import { ArticleModule } from './modules/article/article.module';
import { AuthTokenModule } from './modules/auth-token/auth-token.module';
import { AttachmentModule } from './modules/attachment/attachment.module';
import { PermissionModule } from './modules/permission/permission.module';

@Module({
  imports: [
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
  ],
  providers: [ConfigModule, AuthModule, UserModule],
  controllers: [],
})
export class AppModule {}
