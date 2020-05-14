import { Args, Query, Mutation, Resolver } from '@nestjs/graphql';

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

import { Permissions, GqlCtx } from '@leaa/api/src/decorators';
import { IGqlCtx } from '@leaa/api/src/interfaces';

@Resolver(() => Setting)
export class SettingResolver {
  constructor(private readonly settingService: SettingService) {}

  @Query(() => SettingsWithPaginationObject)
  async settings(
    @GqlCtx() gqlCtx: IGqlCtx,
    @Args() args: SettingsArgs,
  ): Promise<SettingsWithPaginationObject | undefined> {
    return this.settingService.settings(gqlCtx, args);
  }

  @Query(() => Setting)
  async setting(
    @GqlCtx() gqlCtx: IGqlCtx,
    @Args({ name: 'id', type: () => String }) id: string,
    @Args() args?: SettingArgs,
  ): Promise<Setting | undefined> {
    return this.settingService.setting(gqlCtx, id, args);
  }

  //
  // @Permissions('setting.item-read')
  // DO NOT CHECK PERMISSIONS
  @Query(() => Setting)
  async settingBySlug(
    @GqlCtx() gqlCtx: IGqlCtx,
    @Args({ name: 'slug', type: () => String }) slug: string,
    @Args() args?: SettingArgs,
  ): Promise<Setting | undefined> {
    return this.settingService.settingBySlug(gqlCtx, slug, args);
  }

  @Permissions('setting.item-create')
  @Mutation(() => Setting)
  async createSetting(
    @GqlCtx() gqlCtx: IGqlCtx,
    @Args('setting') args: CreateSettingInput,
  ): Promise<Setting | undefined> {
    return this.settingService.createSetting(gqlCtx, args);
  }

  @Permissions('setting.item-update')
  @Mutation(() => Setting)
  async updateSetting(
    @GqlCtx() gqlCtx: IGqlCtx,
    @Args({ name: 'id', type: () => String }) id: string,
    @Args('setting') args: UpdateSettingInput,
  ): Promise<Setting | undefined> {
    return this.settingService.updateSetting(gqlCtx, id, args);
  }

  @Permissions('setting.item-update')
  @Mutation(() => SettingsObject)
  async updateSettings(
    @GqlCtx() gqlCtx: IGqlCtx,
    @Args({ name: 'settings', type: () => [UpdateSettingsInput] }) settings: UpdateSettingsInput[],
  ): Promise<SettingsObject> {
    return this.settingService.updateSettings(gqlCtx, settings);
  }

  @Permissions('setting.item-delete')
  @Mutation(() => Setting)
  async deleteSetting(
    @GqlCtx() gqlCtx: IGqlCtx,
    @Args({ name: 'id', type: () => String }) id: string,
  ): Promise<Setting | undefined> {
    return this.settingService.deleteSetting(gqlCtx, id);
  }
}
