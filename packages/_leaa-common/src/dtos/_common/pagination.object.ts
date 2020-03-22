import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class PaginationObject {
  @Field(() => Int, { nullable: true })
  readonly page!: number;

  @Field(() => Int)
  readonly pageSize!: number;

  @Field(() => Int, { nullable: true })
  readonly nextPage?: number | null;

  @Field(() => Int)
  readonly itemsCount?: number;

  @Field(() => Int)
  readonly total!: number;
}
