import { ObjectType, Field } from '@nestjs/graphql';

import { Setting } from '@leaa/common/src/entrys';

@ObjectType()
export class SettingsObject {
  @Field(() => [Setting])
  readonly items!: Setting[];
}
