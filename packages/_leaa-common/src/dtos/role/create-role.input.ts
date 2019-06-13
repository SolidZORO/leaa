import { IsNotEmpty } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class CreateRoleInput {
  @Field()
  @IsNotEmpty()
  name!: string;

  @Field()
  @IsNotEmpty()
  slug!: string;
}
