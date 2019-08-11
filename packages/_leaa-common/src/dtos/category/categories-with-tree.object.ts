import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class CategoriesWithTreeObject {
  @Field(() => String)
  readonly treeByStringify?: string;
}
