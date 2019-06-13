import { Field, InputType } from 'type-graphql';

@InputType()
export class UpdatePermissionInput {
  @Field()
  name?: string;

  @Field()
  slug?: string;
}
