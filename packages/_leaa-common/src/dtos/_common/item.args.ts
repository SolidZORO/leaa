import { ArgsType, Field, Int } from 'type-graphql';

@ArgsType()
export class ItemArgs {
  @Field(() => Int)
  readonly id?: number;
}
