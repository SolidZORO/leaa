import { IsOptional, IsNotEmpty, Length, MinLength, IsEmail, IsPhoneNumber } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class CreateUserInput {
  @IsOptional()
  @IsPhoneNumber('CN')
  @Field({ nullable: true })
  phone?: string;

  @IsNotEmpty()
  @IsEmail()
  @MinLength(4)
  @Field(() => String)
  email!: string;

  @IsOptional()
  @Length(1, 64)
  @Field(() => String, { nullable: true })
  name?: string;

  @IsNotEmpty()
  @Length(6, 64)
  @Field(() => String)
  password!: string;

  @Field(() => Int, { nullable: true })
  status?: number;

  @Field(() => Int, { nullable: true })
  is_admin?: number;

  @Field(() => String, { nullable: true })
  avatar_string?: string;
}
