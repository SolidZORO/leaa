import { ArgsType, Field, Int } from 'type-graphql';

export type IOrderSort = 'ASC' | 'DESC' | undefined;

@ArgsType()
export class ItemsArgs {
  @Field(() => Int, { nullable: true, defaultValue: 1 })
  public readonly page?: number = 1;

  @Field(() => Int, { nullable: true, defaultValue: 30 })
  public readonly pageSize?: number = 30;

  @Field(() => String, { nullable: true, defaultValue: 'created_at' })
  public readonly orderBy?: string = 'created_at';

  @Field(() => String, { nullable: true, defaultValue: 'DESC' })
  public readonly orderSort?: IOrderSort = 'DESC';

  // q -> query -> keyword
  @Field(() => String, { nullable: true })
  public readonly q?: string;
}
