import { ObjectType, Field, Int } from 'type-graphql';

@ObjectType()
export class PaginationObject {
  @Field(() => Int, { nullable: true })
  readonly page!: number;

  @Field(() => Int)
  readonly pageSize!: number;

  @Field(() => Int)
  readonly total!: number;
}
