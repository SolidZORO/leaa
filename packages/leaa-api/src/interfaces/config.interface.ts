export interface IDotEnv {
  __ENV__: string;
  TZ: string;

  DEMO_MODE: string;
  DEBUG_MODE: string;

  SERVER_NAME: string;
  SERVER_PROTOCOL: string;
  SERVER_HOST: string;
  SERVER_PORT: number;

  PUBLIC_DIR: string;
  TRUST_PROXY: string;
  JWT_SECRET_KEY: string;

  SERVER_COOKIE_EXPIRES_SECOND: number;

  DB_TYPE: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_DATABASE: string;
  DB_SYNCHRONIZE: string;

  RATELIMIT_WINDOWMS: number;
  RATELIMIT_MAX: number;
  ENABLE_CAPTCHA_BY_LOGIN_FAILD_TIMES: number;

  ATTACHMENT_DIR: string;
  ATTACHMENT_LIMIT_SIZE_MB: number;
  ATTACHMENT_SAVE_IN_LOCAL: string;
  ATTACHMENT_SAVE_IN_OSS: string;

  ATTACHMENT_OSS_ALIYUN_BUCKET?: string;
  ATTACHMENT_OSS_ALIYUN_AK_SECRET?: string;
  ATTACHMENT_OSS_ALIYUN_AK_ID?: string;
  ATTACHMENT_OSS_ALIYUN_REGION?: string;
  ATTACHMENT_OSS_ALIYUN_CALLBACK_URL?: string;

  DEFAULT_IMAGE_FILENAME: string;
  DEFAULT_AVATAR_FILENAME: string;

  GRAVATAR_TYPE: string;
  AUTO_CUT_TAGS: string;

  OAUTH_WECHAT_APP_ID?: string;
  OAUTH_WECHAT_APP_SECRET?: string;
  OAUTH_WECHAT_MINIPROGRAM_APP_ID?: string;
  OAUTH_WECHAT_MINIPROGRAM_APP_SECRET?: string;
  OAUTH_WECHAT_TOKEN?: string;
  OAUTH_WECHAT_CALLBACK_URL?: string;

  OAUTH_GITHUB_CLIENT_ID?: string;
  OAUTH_GITHUB_CLIENT_SECRET?: string;
  OAUTH_GITHUB_CALLBACK_URL?: string;
}

export interface IBuild {
  NAME: string;
  MODE: string;
  VERSION: string;
  BUILDTIME: string;
}
