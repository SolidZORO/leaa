import { IsNotEmpty } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreatePermissionInput {
  @IsNotEmpty()
  @Field(() => String)
  name!: string;

  @IsNotEmpty()
  @Field(() => String)
  slug!: string;
}
