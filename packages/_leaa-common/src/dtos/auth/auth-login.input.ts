import { Length, MinLength, IsEmail, IsOptional } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AuthLoginInput {
  @IsEmail()
  @MinLength(6)
  @Field(() => String)
  email!: string;

  @Length(6, 64)
  @Field(() => String)
  password!: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  captcha?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  guestToken?: string;
}
