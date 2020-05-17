import { ObjectType, Field, Int } from '@nestjs/graphql';

import { Category } from '@leaa/common/src/entrys';

@ObjectType()
export class CategoryTreeObject extends Category {
  // @Field(() => String)
  // readonly key!: string;

  @Field(() => String)
  readonly value!: string;

  @Field(() => String, { nullable: true })
  readonly title?: string;

  @Field(() => String, { nullable: true })
  readonly subtitle?: string;

  @Field(() => Boolean, { nullable: true })
  readonly expanded?: boolean | 'true' | 'false';

  @Field(() => [CategoryTreeObject], { nullable: true })
  readonly children?: CategoryTreeObject[];
}
