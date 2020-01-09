import { FindOneOptions } from 'typeorm';
import { AuthsArgs, AuthArgs } from '@leaa/common/src/dtos/auth';
import { Auth } from '@leaa/common/src/entrys';

export type IAuthsArgs = AuthsArgs & FindOneOptions<Auth>;
export type IAuthArgs = AuthArgs & FindOneOptions<Auth>;

export interface IWechatDecryptUserInfo {
  openId: string;
  nickName: string;
  gender: number;
  language: string;
  city: string;
  province: string;
  country: string;
  avatarUrl: string;
  watermark: {
    timestamp: number;
    appid: string;
  };
}
