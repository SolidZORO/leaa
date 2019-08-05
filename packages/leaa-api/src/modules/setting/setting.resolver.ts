import { Args, Query, Mutation, Resolver } from '@nestjs/graphql';
import { Int } from 'type-graphql';

import { Setting, User } from '@leaa/common/entrys';
import {
  SettingsArgs,
  SettingsWithPaginationObject,
  SettingArgs,
  CreateSettingInput,
  UpdateSettingInput,
  UpdateSettingsInput, SettingsObject,
} from '@leaa/common/dtos/setting';
import { UserDecorator } from '@leaa/api/decorators';
import { SettingService } from '@leaa/api/modules/setting/setting.service';

@Resolver(() => Setting)
export class SettingResolver {
  constructor(private readonly settingService: SettingService) {}

  @Query(() => SettingsWithPaginationObject)
  async settings(
    @Args() args: SettingsArgs,
    @UserDecorator() user?: User,
  ): Promise<SettingsWithPaginationObject | undefined> {
    return this.settingService.settings(args, user);
  }

  @Query(() => Setting)
  async setting(
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args() args?: SettingArgs,
    @UserDecorator() user?: User,
  ): Promise<Setting | undefined> {
    return this.settingService.setting(id, args, user);
  }

  @Mutation(() => Setting)
  async createSetting(@Args('setting') args: CreateSettingInput): Promise<Setting | undefined> {
    return this.settingService.craeteSetting(args);
  }

  @Mutation(() => Setting)
  async updateSetting(
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args('setting') args: UpdateSettingInput,
  ): Promise<Setting | undefined> {
    return this.settingService.updateSetting(id, args);
  }

  @Mutation(() => SettingsObject)
  async updateSettings(
    @Args({ name: 'settings', type: () => [UpdateSettingsInput] }) settings: UpdateSettingsInput[],
  ): Promise<SettingsObject> {
    return this.settingService.updateSettings(settings);
  }

  @Mutation(() => Setting)
  async deleteSetting(@Args({ name: 'id', type: () => Int }) id: number): Promise<Setting | undefined> {
    return this.settingService.deleteSetting(id);
  }
}
