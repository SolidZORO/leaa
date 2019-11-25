import { IsOptional, IsNotEmpty, Length, MinLength, IsEmail, IsPhoneNumber } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class CreateUserInput {
  @IsOptional()
  @IsPhoneNumber('CN')
  @Field({ nullable: true })
  public phone?: string;

  @IsNotEmpty()
  @IsEmail()
  @MinLength(4)
  @Field(() => String)
  public email!: string;

  @IsOptional()
  @Length(1, 64)
  @Field(() => String, { nullable: true })
  public name?: string;

  @IsNotEmpty()
  @Length(6, 64)
  @Field(() => String)
  public password!: string;

  @Field(() => Int, { nullable: true })
  public status?: number;
}
