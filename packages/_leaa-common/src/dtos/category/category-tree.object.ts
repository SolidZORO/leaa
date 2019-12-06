import { ObjectType, Field, Int } from 'type-graphql';

import { Category } from '@leaa/common/src/entrys';

@ObjectType()
export class CategoryTreeObject extends Category {
  @Field(() => String)
  readonly key!: string;

  @Field(() => Int)
  readonly value!: number;

  @Field(() => String, { nullable: true })
  readonly title?: string;

  @Field(() => String, { nullable: true })
  readonly subtitle?: string;

  @Field(() => Boolean, { nullable: true })
  readonly expanded?: boolean;

  @Field(() => [CategoryTreeObject], { nullable: true })
  readonly children?: CategoryTreeObject[];
}
