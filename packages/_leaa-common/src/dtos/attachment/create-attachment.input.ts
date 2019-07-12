import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class CreateAttachmentInput {
  @Field(() => String)
  uuid!: string;

  @Field(() => String)
  title!: string;

  @Field(() => String)
  alt!: string;

  @Field(() => String)
  filename!: string;

  // @Field(() => String, { nullable: true })
  // description?: string;

  // @Field(() => String, { nullable: true })
  // link?: string;

  @Field(() => String)
  moduleName!: string;

  @Field(() => String)
  moduleId!: number;

  @Field(() => String)
  moduleType!: string;

  @Field(() => String)
  ext!: string;

  @Field(() => Int)
  width!: number;

  @Field(() => Int)
  height!: number;

  @Field(() => Int)
  size?: number;

  @Field(() => String)
  path!: string;

  @Field(() => Int)
  at2x!: number;

  @Field(() => Int)
  inLocal?: number;

  @Field(() => Int)
  inCloud?: number;

  @Field(() => Int, { nullable: true })
  categoryId?: number;

  @Field(() => Int, { nullable: true })
  userId?: number;

  @Field(() => Int)
  sort?: number;

  @Field(() => Int)
  status?: number;
}
