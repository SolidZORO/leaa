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
  @MinLength(6)
  @Field(() => String)
  email!: string;

  @IsOptional()
  @Length(4, 64)
  @Field(() => String, { nullable: true })
  name?: string;

  @IsNotEmpty()
  @Length(6, 64)
  @Field(() => String)
  password!: string;

  @Field(() => Int, { nullable: true })
  status?: number;
}
