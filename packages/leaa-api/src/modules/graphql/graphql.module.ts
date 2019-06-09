import { Module } from '@nestjs/common';

import { UserModule } from '@leaa/api/modules/user/user.module';
import { GraphqlService } from './graphql.service';

@Module({
  imports: [UserModule],
  providers: [GraphqlService],
})
export class GraphqlModule {}
