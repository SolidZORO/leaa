import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class UpdateRoleInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  slug?: string;

  @Field(() => [Int], { nullable: true })
  permissionIds?: number[];

  @Field(() => [String], { nullable: true })
  permissionSlugs?: string[];
}
