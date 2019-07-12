import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class UpdateAttachmentInput {
  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String, { nullable: true })
  link?: string;

  @Field(() => Int, { nullable: true })
  categoryId?: number;

  @Field(() => Int)
  sort!: number;

  @Field(() => Int)
  status!: number;
}
