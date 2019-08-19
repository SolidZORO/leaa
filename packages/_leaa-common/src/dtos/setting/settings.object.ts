import { ObjectType, Field } from 'type-graphql';

import { Setting } from '@leaa/common/src/entrys';

@ObjectType()
export class SettingsObject {
  @Field(() => [Setting])
  public readonly items!: Setting[];
}
