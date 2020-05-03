import { UseGuards } from '@nestjs/common';
import { Args, Query, Mutation, Resolver, Int } from '@nestjs/graphql';

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
import { PermissionsGuard } from '@leaa/api/src/guards';
import { Permissions, GqlCtx } from '@leaa/api/src/decorators';
import { IGqlCtx } from '@leaa/api/src/interfaces';

@Resolver(() => Setting)
export class SettingResolver {
  constructor(private readonly settingService: SettingService) {}

  @Query(() => SettingsWithPaginationObject)
  async settings(
    @Args() args: SettingsArgs,
    @GqlCtx() gqlCtx?: IGqlCtx,
  ): Promise<SettingsWithPaginationObject | undefined> {
    return this.settingService.settings(args, gqlCtx);
  }

  @Query(() => Setting)
  async setting(
    @Args({ name: 'id', type: () => String }) id: string,
    @Args() args?: SettingArgs,
    @GqlCtx() gqlCtx?: IGqlCtx,
  ): Promise<Setting | undefined> {
    return this.settingService.setting(id, args, gqlCtx);
  }

  // @UseGuards(PermissionsGuard)
  // @Permissions('setting.item-read')
  // DO NOT CHECK PERMISSIONS
  @Query(() => Setting)
  async settingBySlug(
    @Args({ name: 'slug', type: () => String }) slug: string,
    @Args() args?: SettingArgs,
    @GqlCtx() gqlCtx?: IGqlCtx,
  ): Promise<Setting | undefined> {
    return this.settingService.settingBySlug(slug, args, gqlCtx);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('setting.item-create')
  @Mutation(() => Setting)
  async createSetting(@Args('setting') args: CreateSettingInput): Promise<Setting | undefined> {
    return this.settingService.createSetting(args);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('setting.item-update')
  @Mutation(() => Setting)
  async updateSetting(
    @Args({ name: 'id', type: () => String }) id: string,
    @Args('setting') args: UpdateSettingInput,
    @GqlCtx() gqlCtx?: IGqlCtx,
  ): Promise<Setting | undefined> {
    return this.settingService.updateSetting(id, args, gqlCtx);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('setting.item-update')
  @Mutation(() => SettingsObject)
  async updateSettings(
    @Args({ name: 'settings', type: () => [UpdateSettingsInput] }) settings: UpdateSettingsInput[],
    @GqlCtx() gqlCtx?: IGqlCtx,
  ): Promise<SettingsObject> {
    return this.settingService.updateSettings(settings, gqlCtx);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('setting.item-delete')
  @Mutation(() => Setting)
  async deleteSetting(
    @Args({ name: 'id', type: () => String }) id: string,
    @GqlCtx() gqlCtx?: IGqlCtx,
  ): Promise<Setting | undefined> {
    return this.settingService.deleteSetting(id, gqlCtx);
  }
}
