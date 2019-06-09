import { IsOptional, IsNotEmpty, Length, MinLength, IsEmail, IsPhoneNumber } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class CreateUserInputDto {
  @Field()
  @IsPhoneNumber('CN')
  @IsNotEmpty()
  phone!: string;

  @Field()
  @IsNotEmpty()
  @IsEmail()
  @MinLength(6)
  email!: string;

  @Field({ nullable: true })
  @IsOptional()
  @Length(4, 64)
  name?: string;
}
