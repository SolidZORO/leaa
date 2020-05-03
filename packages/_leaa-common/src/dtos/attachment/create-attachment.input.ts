import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateAttachmentInput {
  @Field(() => String)
  uuid!: string;

  @Field(() => String)
  title!: string;

  @Field(() => String)
  alt!: string;

  @Field(() => String)
  type!: string;

  @Field(() => String)
  filename!: string;

  // @Field(() => String, { nullable: true })
  // description?: string;

  // @Field(() => String, { nullable: true })
  // link?: string;

  @Field(() => String)
  moduleName!: string;

  @Field(() => String)
  moduleId!: string;

  @Field(() => String)
  typeName!: string;

  @Field(() => String, { nullable: true })
  typePlatform?: string;

  @Field(() => String)
  ext!: string;

  @Field(() => Int)
  width!: number;

  @Field(() => Int)
  height!: number;

  @Field(() => Int)
  size!: number;

  @Field(() => String)
  path!: string;

  @Field(() => String, { nullable: true })
  external_url?: string;

  @Field(() => Int)
  at2x!: number;

  @Field(() => Int)
  in_local!: number;

  @Field(() => Int)
  in_oss!: number;

  @Field(() => String, { nullable: true })
  categoryId?: string | null;

  @Field(() => String, { nullable: true })
  userId?: string | null;

  @Field(() => Int)
  sort!: number;

  @Field(() => Int)
  status!: number;
}
