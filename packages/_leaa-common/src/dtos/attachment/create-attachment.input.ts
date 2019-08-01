import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class CreateAttachmentInput {
  @Field(() => String)
  public uuid!: string;

  @Field(() => String)
  public title!: string;

  @Field(() => String)
  public alt!: string;

  @Field(() => String)
  public type!: string;

  @Field(() => String)
  public filename!: string;

  // @Field(() => String, { nullable: true })
  // public description?: string;

  // @Field(() => String, { nullable: true })
  // public link?: string;

  @Field(() => String)
  public module_name!: string;

  @Field(() => Int)
  public module_id!: number;

  @Field(() => String)
  public module_type!: string;

  @Field(() => String)
  public ext!: string;

  @Field(() => Int)
  public width!: number;

  @Field(() => Int)
  public height!: number;

  @Field(() => Int)
  public size?: number;

  @Field(() => String)
  public path!: string;

  @Field(() => Int)
  public at2x!: number;

  @Field(() => Int)
  public in_local?: number;

  @Field(() => Int, { nullable: true })
  public in_cloud?: number;

  @Field(() => Int, { nullable: true })
  public category_id?: number;

  @Field(() => Int, { nullable: true })
  public user_id?: number;

  @Field(() => Int)
  public sort?: number;

  @Field(() => Int)
  public status?: number;
}
