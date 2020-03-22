import { Field, InputType, Int } from '@nestjs/graphql';

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

  @Field(() => String, { nullable: true })
  external_url?: string;
}
