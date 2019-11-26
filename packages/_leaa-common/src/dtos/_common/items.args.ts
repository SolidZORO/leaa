import { ArgsType, Field, Int } from 'type-graphql';

export type IOrderSort = 'ASC' | 'DESC' | undefined;

@ArgsType()
export class ItemsArgs {
  @Field(() => Int, { nullable: true, defaultValue: 1 })
  readonly page?: number = 1;

  @Field(() => Int, { nullable: true, defaultValue: 30 })
  readonly pageSize?: number = 30;

  @Field(() => String, { nullable: true, defaultValue: 'id' })
  readonly orderBy?: string = 'id';

  @Field(() => String, { nullable: true, defaultValue: 'DESC' })
  readonly orderSort?: IOrderSort = 'DESC';

  // q -> query -> keyword
  @Field(() => String, { nullable: true })
  readonly q?: string;
}
