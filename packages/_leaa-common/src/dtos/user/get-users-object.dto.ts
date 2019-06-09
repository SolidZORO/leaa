// import { Max, Min } from 'class-validator';
import { ObjectType, Field } from 'type-graphql';

import { User } from '@leaa/common/entrys';
import { CommonPaginationObjectDto } from '@leaa/common/dtos/_common';

@ObjectType()
export class GetUsersObjectDto extends CommonPaginationObjectDto {
  @Field(() => [User])
  readonly items: User[] = [];
}
