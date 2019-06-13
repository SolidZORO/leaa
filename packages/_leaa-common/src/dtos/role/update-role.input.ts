import { Field, InputType } from 'type-graphql';

@InputType()
export class UpdateRoleInput {
  @Field()
  name?: string;

  @Field()
  slug?: string;
}
