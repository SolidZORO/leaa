import { IsOptional } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdatePermissionInput {
  @IsOptional()
  @Field(() => String, { nullable: true })
  name?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  slug?: string;
}
