import { IsNotEmpty } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class CreatePermissionInput {
  @IsNotEmpty()
  @Field()
  name!: string;

  @IsNotEmpty()
  @Field()
  slug!: string;
}
