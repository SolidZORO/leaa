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
