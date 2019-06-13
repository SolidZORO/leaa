import { IsOptional, IsNotEmpty, Length, MinLength, IsEmail, IsPhoneNumber } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class CreateUserInput {
  @Field({ nullable: true })
  @IsPhoneNumber('CN')
  phone?: string;

  @Field()
  @IsNotEmpty()
  @IsEmail()
  @MinLength(6)
  email!: string;

  @Field({ nullable: true })
  @IsOptional()
  @Length(4, 64)
  name?: string;

  @Field()
  @IsNotEmpty()
  @Length(6, 64)
  password!: string;

  @Field({ nullable: true })
  @Length(1)
  status?: number;
}
