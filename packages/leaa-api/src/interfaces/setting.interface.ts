import { FindOneOptions } from 'typeorm';
import { SettingsArgs, SettingArgs } from '@leaa/common/src/dtos/setting';
import { Setting } from '@leaa/common/src/entrys';

export type ISettingsArgs = SettingsArgs & FindOneOptions<Setting>;
export type ISettingArgs = SettingArgs & FindOneOptions<Setting>;
