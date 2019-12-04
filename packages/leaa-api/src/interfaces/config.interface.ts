export interface IDotEnv {
  PROTOCOL: string;
  PORT: number;

  BASE_HOST: string;
  PUBLIC_DIR: string;
  ATTACHMENT_DIR: string;
  ATTACHMENT_LIMIT_SIZE_MB: number;
  ATTACHMENT_SAVE_IN_LOCAL: string;
  ATTACHMENT_SAVE_IN_OSS: string;

  DB_TYPE: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_DATABASE: string;
  DB_SYNCHRONIZE: string;

  TRUST_PROXY: string;
  JWT_SECRET_KEY: string;
  CLIENT_COOKIE_EXPIRES_SECOND: number;
  SERVER_COOKIE_EXPIRES_SECOND: number;

  OSS_ALIYUN_BUCKET?: string;
  OSS_ALIYUN_AK_SECRET?: string;
  OSS_ALIYUN_AK_ID?: string;
  OSS_ALIYUN_REGION?: string;
  OSS_ALIYUN_CALLBACK_URL?: string;

  OAUTH_WECHAT_APP_ID?: string;
  OAUTH_WECHAT_APP_SECRET?: string;
  OAUTH_WECHAT_MINIPROGRAM_APP_ID?: string;
  OAUTH_WECHAT_MINIPROGRAM_APP_SECRET?: string;
  OAUTH_WECHAT_TOKEN?: string;
  OAUTH_WECHAT_REDIRECT_URL?: string;
}

export interface IBuild {
  // MODE: string;
  VERSION: string;
  TIMESTAMP: string;
}
