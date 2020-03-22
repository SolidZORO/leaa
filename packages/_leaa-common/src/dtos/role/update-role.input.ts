import { IsOptional } from 'class-validator';
import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateRoleInput {
  @IsOptional()
  @Field(() => String, { nullable: true })
  name?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  slug?: string;

  @IsOptional()
  @Field(() => [Int], { nullable: true })
  permissionIds?: number[];

  @IsOptional()
  @Field(() => [String], { nullable: true })
  permissionSlugs?: string[];
}
