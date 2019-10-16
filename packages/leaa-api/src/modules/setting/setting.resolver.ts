import { Args, Query, Mutation, Resolver } from '@nestjs/graphql';
import { Int } from 'type-graphql';

import { Setting } from '@leaa/common/src/entrys';
import {
  SettingsArgs,
  SettingsWithPaginationObject,
  SettingArgs,
  CreateSettingInput,
  UpdateSettingInput,
  UpdateSettingsInput,
  SettingsObject,
} from '@leaa/common/src/dtos/setting';
import { SettingService } from '@leaa/api/src/modules/setting/setting.service';

@Resolver(() => Setting)
export class SettingResolver {
  constructor(private readonly settingService: SettingService) {}

  @Query(() => SettingsWithPaginationObject)
  async settings(@Args() args: SettingsArgs): Promise<SettingsWithPaginationObject | undefined> {
    return this.settingService.settings(args);
  }

  @Query(() => Setting)
  async setting(
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args() args?: SettingArgs,
  ): Promise<Setting | undefined> {
    return this.settingService.setting(id, args);
  }

  @Query(() => Setting)
  async settingBySlug(
    @Args({ name: 'slug', type: () => String }) slug: string,
    @Args() args?: SettingArgs,
  ): Promise<Setting | undefined> {
    return this.settingService.settingBySlug(slug, args);
  }

  @Mutation(() => Setting)
  async createSetting(@Args('setting') args: CreateSettingInput): Promise<Setting | undefined> {
    return this.settingService.createSetting(args);
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
