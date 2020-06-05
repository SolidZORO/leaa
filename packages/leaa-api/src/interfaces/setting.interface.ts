import { FindOneOptions } from 'typeorm';
import { SettingGetManyReq, SettingGetOneReq } from '@leaa/api/src/dtos/setting';
import { Setting } from '@leaa/api/src/entrys';

export type ISettingsArgs = SettingGetManyReq & FindOneOptions<Setting>;
export type ISettingArgs = SettingGetOneReq & FindOneOptions<Setting>;
