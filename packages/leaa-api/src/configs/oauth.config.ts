import { envConfig } from '@leaa/api/src/modules/config/config.module';

export const wechat = {
  appId: envConfig.OAUTH_WECHAT_APP_ID,
  appSecret: envConfig.OAUTH_WECHAT_APP_SECRET,
  wechatToken: envConfig.OAUTH_WECHAT_TOKEN,
  wechatRedirectUrl: envConfig.OAUTH_WECHAT_CALLBACK_URL,
  // card: false,
  // payment: false,
  // merchantId: '',
  // paymentSandBox: false,
  // paymentKey: '',
  // paymentCertificatePfx: fs.readFileSync(path.join(process.cwd(), 'cert/xxx.p12')),
  // paymentNotifyUrl: '',
  miniProgram: {
    appId: envConfig.OAUTH_WECHAT_MINIPROGRAM_APP_ID,
    appSecret: envConfig.OAUTH_WECHAT_MINIPROGRAM_APP_SECRET,
  },
};

export const oauthConfig = {
  wechat,
};
