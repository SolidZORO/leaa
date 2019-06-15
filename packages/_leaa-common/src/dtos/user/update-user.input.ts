import { IsOptional, Length, MinLength, IsEmail, IsPhoneNumber } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  @IsPhoneNumber('CN')
  phone?: string;

  @Field({ nullable: true })
  @IsEmail()
  @MinLength(6)
  email?: string;

  @Field({ nullable: true })
  @IsOptional()
  @Length(4, 64)
  name?: string;

  @Field({ nullable: true })
  @Length(6, 64)
  password?: string;

  @Field({ nullable: true })
  @Length(1)
  status?: number;

  @Field(() => [Int], { nullable: true })
  roleIds?: number[];
}
