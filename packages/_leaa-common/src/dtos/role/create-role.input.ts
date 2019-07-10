import { IsNotEmpty } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class CreateRoleInput {
  @IsNotEmpty()
  @Field()
  name!: string;

  @IsNotEmpty()
  @Field()
  slug!: string;
}
