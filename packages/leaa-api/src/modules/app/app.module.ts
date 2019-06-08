import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import { User } from '@leaa/common/entrys';
import { ConfigModule, envConfig } from '@leaa/api/modules/config/config.module';
import { AppController } from '@leaa/api/modules/app/app.controller';
import { AppService } from '@leaa/api/modules/app/app.service';

console.log(envConfig);

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      connectTimeout: 10000,
      acquireTimeout: 10000,
      host: envConfig.MYSQL_HOST,
      port: envConfig.MYSQL_PORT,
      username: envConfig.MYSQL_USER,
      password: envConfig.MYSQL_PASSWORD,
      database: envConfig.MYSQL_DATABASE,
      // synchronize: false,
      synchronize: true,
      logging: true,
      entities: [
        // `${__dirname}/**/*.entity{.js,.ts}`,
        //
        // for @zeit/ncc import
        User,
      ],
    }),
    ConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private readonly connection: Connection) {}
}
