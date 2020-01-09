import { FindOneOptions } from 'typeorm';
import { OauthsArgs, OauthArgs } from '@leaa/common/src/dtos/oauth';
import { Oauth } from '@leaa/common/src/entrys';

export type IOauthsArgs = OauthsArgs & FindOneOptions<Oauth>;
export type IOauthArgs = OauthArgs & FindOneOptions<Oauth>;

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
