import { IsOptional, Length, MinLength, IsEmail, IsPhoneNumber } from 'class-validator';
import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput {
  @IsOptional()
  @IsPhoneNumber('CN')
  @Field(() => String, { nullable: true })
  phone?: string;

  @IsOptional()
  @IsEmail()
  @MinLength(4)
  @Field(() => String, { nullable: true })
  email?: string;

  @IsOptional()
  @Length(1, 64)
  @Field(() => String, { nullable: true })
  name?: string;

  @IsOptional()
  @Length(6, 64)
  @Field(() => String, { nullable: true })
  password?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  avatar_url?: string | null;

  @IsOptional()
  @Field(() => Int, { nullable: true })
  status?: number;

  @IsOptional()
  @Field(() => Int, { nullable: true })
  is_admin?: number;

  @IsOptional()
  @Field(() => [String], { nullable: true })
  roleIds?: string[];

  // @IsOptional()
  // @Field(() => [String], { nullable: true })
  // roleSlugs?: string[];
}
