import { ArgsType, Field, Int } from '@nestjs/graphql';

export type IOrderSort = 'ASC' | 'DESC' | undefined;

@ArgsType()
export class ItemsArgs {
  @Field(() => Int, { nullable: true, defaultValue: 1 })
  page?: number = 1;

  @Field(() => Int, { nullable: true, defaultValue: 30 })
  pageSize?: number = 30;

  @Field(() => String, { nullable: true, defaultValue: 'id' })
  orderBy?: string = 'id';

  @Field(() => String, { nullable: true, defaultValue: 'DESC' })
  orderSort?: IOrderSort = 'DESC';

  // q -> query -> keyword
  @Field(() => String, { nullable: true })
  q?: string;
}
