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
  public moduleName!: string;

  @Field(() => Int)
  public moduleId!: number;

  @Field(() => String)
  public moduleType!: string;

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
  public inLocal?: number;

  @Field(() => Int, { nullable: true })
  public inCloud?: number;

  @Field(() => Int, { nullable: true })
  public categoryId?: number;

  @Field(() => Int, { nullable: true })
  public userId?: number;

  @Field(() => Int)
  public sort?: number;

  @Field(() => Int)
  public status?: number;
}
