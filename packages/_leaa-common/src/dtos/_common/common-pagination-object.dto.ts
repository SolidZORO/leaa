import { ObjectType, Field, Int } from 'type-graphql';

@ObjectType()
export class CommonPaginationObjectDto {
  @Field(() => Int, { nullable: true })
  readonly page: number = 1;

  @Field(() => Int)
  readonly pageSize: number = 30;

  @Field(() => Int)
  readonly total: number = 0;
}
