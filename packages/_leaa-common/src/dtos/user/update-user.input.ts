import { IsOptional, Length, MinLength, IsEmail, IsPhoneNumber } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class UpdateUserInput {
  @IsPhoneNumber('CN')
  @Field({ nullable: true })
  phone?: string;

  @IsEmail()
  @MinLength(6)
  @Field({ nullable: true })
  email?: string;

  @IsOptional()
  @Length(4, 64)
  @Field({ nullable: true })
  name?: string;

  @Length(6, 64)
  @Field({ nullable: true })
  password?: string;

  @Length(1)
  @Field({ nullable: true })
  status?: number;

  @Field(() => [Int], { nullable: true })
  roleIds?: number[];

  @Field(() => [String], { nullable: true })
  roleSlugs?: string[];
}
