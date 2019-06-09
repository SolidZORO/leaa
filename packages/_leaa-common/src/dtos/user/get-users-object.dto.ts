// import { Max, Min } from 'class-validator';
import { ObjectType, Field, Int } from 'type-graphql';

import { User } from '@leaa/common/entrys';

@ObjectType()
export class GetUsersObjectDto {
  @Field(() => Int)
  readonly total: number = 0;

  @Field(() => [User])
  readonly items: User[] = [];
}
