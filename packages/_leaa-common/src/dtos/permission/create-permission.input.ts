import { IsNotEmpty } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class CreatePermissionInput {
  @Field()
  @IsNotEmpty()
  name!: string;

  @Field()
  @IsNotEmpty()
  slug!: string;
}
