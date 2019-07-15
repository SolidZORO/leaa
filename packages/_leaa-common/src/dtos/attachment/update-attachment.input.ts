import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class UpdateAttachmentInput {
  @Field(() => String, { nullable: true })
  title?: string;

  @Field(() => String, { nullable: true })
  link?: string;

  @Field(() => Int)
  sort!: number;

  @Field(() => Int)
  status!: number;
}
