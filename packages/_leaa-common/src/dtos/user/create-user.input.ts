import { IsOptional, IsNotEmpty, Length, MinLength, IsEmail, IsPhoneNumber } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class CreateUserInput {
  @IsPhoneNumber('CN')
  @Field({ nullable: true })
  phone?: string;

  @IsNotEmpty()
  @IsEmail()
  @MinLength(6)
  @Field()
  email!: string;

  @IsOptional()
  @Length(4, 64)
  @Field({ nullable: true })
  name?: string;

  @IsNotEmpty()
  @Length(6, 64)
  @Field()
  password!: string;

  @Length(1)
  @Field({ nullable: true })
  status?: number;
}
