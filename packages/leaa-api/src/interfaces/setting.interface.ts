import { FindOneOptions } from 'typeorm';
import { SettingGetManyReq, SettingGetOneReq } from '@leaa/common/src/dtos/setting';
import { Setting } from '@leaa/common/src/entrys';

export type ISettingsArgs = SettingGetManyReq & FindOneOptions<Setting>;
export type ISettingArgs = SettingGetOneReq & FindOneOptions<Setting>;
