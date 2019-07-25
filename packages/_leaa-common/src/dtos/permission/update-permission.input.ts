import { IsOptional } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class UpdatePermissionInput {
  @IsOptional()
  @Field(() => String, { nullable: true })
  public name?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  public slug?: string;
}
