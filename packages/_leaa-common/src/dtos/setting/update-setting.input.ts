import { IsOptional } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class UpdateSettingInput {
  @IsOptional()
  @Field(() => String, { nullable: true })
  public name?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  public slug?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  public type?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  public description?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  public value?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  public options?: string;

  @IsOptional()
  @Field(() => Int, { nullable: true })
  public sort?: number;
}
