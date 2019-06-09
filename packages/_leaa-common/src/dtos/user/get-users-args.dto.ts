import { Max, Min } from 'class-validator';
import { ArgsType, Field, Int } from 'type-graphql';

import { CommonGetItemsArgsDto } from '@leaa/common/dtos/_common';

@ArgsType()
export class GetUsersArgsDto extends CommonGetItemsArgsDto {
  @Field(() => Int, { nullable: true })
  @Min(0)
  skip?: number = 0;

  @Field(() => Int, { nullable: true })
  @Min(1)
  take?: number = 30;
}
