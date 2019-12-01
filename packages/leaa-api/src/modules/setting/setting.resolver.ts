import { UseGuards } from '@nestjs/common';
import { Args, Query, Mutation, Resolver } from '@nestjs/graphql';
import { Int } from 'type-graphql';

import { Setting, Promo, User } from '@leaa/common/src/entrys';
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
import { Permissions, CurrentUser } from '@leaa/api/src/decorators';

@Resolver(() => Setting)
export class SettingResolver {
  constructor(private readonly settingService: SettingService) {}

  @UseGuards(PermissionsGuard)
  @Permissions('setting.list-read')
  @Query(() => SettingsWithPaginationObject)
  async settings(
    @Args() args: SettingsArgs,
    @CurrentUser() user?: User,
  ): Promise<SettingsWithPaginationObject | undefined> {
    return this.settingService.settings(args, user);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('setting.item-read')
  @Query(() => Setting)
  async setting(
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args() args?: SettingArgs,
  ): Promise<Setting | undefined> {
    return this.settingService.setting(id, args);
  }

  @Query(() => Promo)
  @Permissions('setting.item-read')
  @Query(() => Setting)
  async settingBySlug(
    @Args({ name: 'slug', type: () => String }) slug: string,
    @Args() args?: SettingArgs,
  ): Promise<Setting | undefined> {
    return this.settingService.settingBySlug(slug, args);
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
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args('setting') args: UpdateSettingInput,
  ): Promise<Setting | undefined> {
    return this.settingService.updateSetting(id, args);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('setting.item-update')
  @Mutation(() => SettingsObject)
  async updateSettings(
    @Args({ name: 'settings', type: () => [UpdateSettingsInput] }) settings: UpdateSettingsInput[],
    @CurrentUser() user?: User,
  ): Promise<SettingsObject> {
    return this.settingService.updateSettings(settings, user);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('setting.item-delete')
  @Mutation(() => Setting)
  async deleteSetting(
    @Args({ name: 'id', type: () => Int }) id: number,
    @CurrentUser() user?: User,
  ): Promise<Setting | undefined> {
    return this.settingService.deleteSetting(id, user);
  }
}
