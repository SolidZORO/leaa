import { IsOptional, Length, MinLength, IsEmail, IsPhoneNumber } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class UpdateUserInput {
  @IsPhoneNumber('CN')
  @Field(() => String, { nullable: true })
  phone?: string;

  @IsEmail()
  @MinLength(6)
  @Field(() => String, { nullable: true })
  email?: string;

  @IsOptional()
  @Length(4, 64)
  @Field(() => String, { nullable: true })
  name?: string;

  @IsOptional()
  @Length(6, 64)
  @Field(() => String, { nullable: true })
  password?: string;

  @IsOptional()
  @Length(1)
  @Field(() => Int, { nullable: true })
  status?: number;

  @IsOptional()
  @Field(() => [Int], { nullable: true })
  roleIds?: number[];

  @IsOptional()
  @Field(() => [String], { nullable: true })
  roleSlugs?: string[];
}
