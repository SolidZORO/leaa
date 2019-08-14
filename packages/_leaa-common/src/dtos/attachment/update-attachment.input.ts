import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class UpdateAttachmentInput {
  @Field(() => String, { nullable: true })
  public title?: string;

  @Field(() => String, { nullable: true })
  public link?: string;

  @Field(() => Int)
  public sort!: number;

  @Field(() => Int)
  public status!: number;

  @Field(() => String, { nullable: true })
  public external_path?: string;
}
