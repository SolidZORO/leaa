import envalid from 'envalid';

import ip from 'ip';

import { IDotEnv } from '@leaa/api/src/interfaces';

export class ConfigService {
  private readonly envConfig: IDotEnv;

  constructor(dotEnvPath: string) {
    this.envConfig = this.validate(dotEnvPath);
  }

  get __ENV__(): string {
    // eslint-disable-next-line no-underscore-dangle
    return this.envConfig.__ENV__;
  }

  get TZ(): string {
    return this.envConfig.TZ || 'Asia/Shanghai';
  }

  get DEMO_MODE(): boolean {
    return Boolean(this.envConfig.DEMO_MODE === 'true');
  }

  get DEBUG_MODE(): boolean {
    return Boolean(this.envConfig.DEBUG_MODE === 'true');
  }

  get SERVER_NAME(): string {
    return this.envConfig.SERVER_NAME;
  }

  get SERVER_PROTOCOL(): string {
    return this.envConfig.SERVER_PROTOCOL;
  }

  get SERVER_HOST(): string {
    return this.envConfig.SERVER_HOST.replace('localhost', ip.address());
  }

  get SERVER_PORT(): number {
    return Number(this.envConfig.SERVER_PORT);
  }

  get PUBLIC_DIR(): string {
    return this.envConfig.PUBLIC_DIR;
  }

  get TRUST_PROXY(): string {
    return this.envConfig.TRUST_PROXY;
  }

  get JWT_SECRET_KEY(): string {
    return this.envConfig.JWT_SECRET_KEY;
  }

  get SERVER_COOKIE_EXPIRES_SECOND(): number {
    return Number(this.envConfig.SERVER_COOKIE_EXPIRES_SECOND);
  }

  //
  //
  // DB

  get DB_TYPE(): string {
    return this.envConfig.DB_TYPE;
  }

  get DB_HOST(): string {
    return this.envConfig.DB_HOST;
  }

  get DB_PORT(): number {
    return Number(this.envConfig.DB_PORT);
  }

  get DB_USERNAME(): string {
    return this.envConfig.DB_USERNAME;
  }

  get DB_PASSWORD(): string {
    return this.envConfig.DB_PASSWORD;
  }

  get DB_DATABASE(): string {
    return this.envConfig.DB_DATABASE;
  }

  get DB_SYNCHRONIZE(): boolean {
    return Boolean(this.envConfig.DB_SYNCHRONIZE === 'true');
  }

  //

  get RATELIMIT_WINDOWMS(): number {
    return Number(this.envConfig.RATELIMIT_WINDOWMS) || 500; // limit each IP to 1000 requests per windowMs
  }

  get RATELIMIT_MAX(): number {
    return Number(this.envConfig.RATELIMIT_MAX) || 5 * 60 * 1000; // 5 minutes
  }

  get ENABLE_CAPTCHA_BY_LOGIN_FAILD_TIMES(): number {
    return Number(this.envConfig.ENABLE_CAPTCHA_BY_LOGIN_FAILD_TIMES) || 5;
  }

  get ATTACHMENT_DIR(): string {
    return this.envConfig.ATTACHMENT_DIR;
  }

  get ATTACHMENT_LIMIT_SIZE_MB(): number {
    return Number(this.envConfig.ATTACHMENT_LIMIT_SIZE_MB);
  }

  get ATTACHMENT_SAVE_IN_LOCAL(): boolean {
    return Boolean(this.envConfig.ATTACHMENT_SAVE_IN_LOCAL === 'true');
  }

  get ATTACHMENT_SAVE_IN_OSS(): boolean {
    return Boolean(this.envConfig.ATTACHMENT_SAVE_IN_OSS === 'true');
  }

  get ATTACHMENT_OSS_ALIYUN_BUCKET(): string {
    return this.envConfig.ATTACHMENT_OSS_ALIYUN_BUCKET || '';
  }

  get ATTACHMENT_OSS_ALIYUN_AK_SECRET(): string {
    return this.envConfig.ATTACHMENT_OSS_ALIYUN_AK_SECRET || '';
  }

  get ATTACHMENT_OSS_ALIYUN_AK_ID(): string {
    return this.envConfig.ATTACHMENT_OSS_ALIYUN_AK_ID || '';
  }

  get ATTACHMENT_OSS_ALIYUN_REGION(): string {
    return this.envConfig.ATTACHMENT_OSS_ALIYUN_REGION || '';
  }

  get ATTACHMENT_OSS_ALIYUN_CALLBACK_URL(): string {
    return this.envConfig.ATTACHMENT_OSS_ALIYUN_CALLBACK_URL || '';
  }

  get DEFAULT_IMAGE_FILENAME(): string {
    return this.envConfig.DEFAULT_IMAGE_FILENAME || 'default-image.svg';
  }

  get DEFAULT_AVATAR_FILENAME(): string {
    return this.envConfig.DEFAULT_AVATAR_FILENAME || 'default-avatar.svg';
  }

  get GRAVATAR_TYPE(): string {
    return this.envConfig.GRAVATAR_TYPE;
  }

  get AUTO_CUT_TAGS(): boolean {
    return Boolean(this.envConfig.AUTO_CUT_TAGS === 'true');
  }

  //
  //
  // OPTIONAL

  get OAUTH_WECHAT_APP_ID(): string {
    return this.envConfig.OAUTH_WECHAT_APP_ID || '';
  }

  get OAUTH_WECHAT_APP_SECRET(): string {
    return this.envConfig.OAUTH_WECHAT_APP_SECRET || '';
  }

  get OAUTH_WECHAT_MINIPROGRAM_APP_ID(): string {
    return this.envConfig.OAUTH_WECHAT_MINIPROGRAM_APP_ID || '';
  }

  get OAUTH_WECHAT_MINIPROGRAM_APP_SECRET(): string {
    return this.envConfig.OAUTH_WECHAT_MINIPROGRAM_APP_SECRET || '';
  }

  get OAUTH_WECHAT_TOKEN(): string {
    return this.envConfig.OAUTH_WECHAT_TOKEN || '';
  }

  get OAUTH_WECHAT_CALLBACK_URL(): string {
    return this.envConfig.OAUTH_WECHAT_CALLBACK_URL || '';
  }

  //

  get OAUTH_GITHUB_CLIENT_ID(): string {
    return this.envConfig.OAUTH_GITHUB_CLIENT_ID || '';
  }

  get OAUTH_GITHUB_CLIENT_SECRET(): string {
    return this.envConfig.OAUTH_GITHUB_CLIENT_SECRET || '';
  }

  get OAUTH_GITHUB_CALLBACK_URL(): string {
    return this.envConfig.OAUTH_GITHUB_CALLBACK_URL || '';
  }

  private validate(dotEnvPath: string): IDotEnv {
    const rule = {
      __ENV__: envalid.str({ choices: ['prod', 'dev', 'test'] }),
      TZ: envalid.str({ default: 'Asia/Shanghai' }),
      //
      DEMO_MODE: envalid.str({ choices: ['true', 'false'], default: 'false' }),
      DEBUG_MODE: envalid.str({ choices: ['true', 'false'], default: 'false' }),
      //
      SERVER_NAME: envalid.str({ default: 'leaa' }),
      SERVER_PROTOCOL: envalid.str({ choices: ['http', 'https'], default: 'http' }),
      SERVER_PORT: envalid.port({ default: 5005 }),
      SERVER_HOST: envalid.str(),
      //
      PUBLIC_DIR: envalid.str(),
      TRUST_PROXY: envalid.str(),
      JWT_SECRET_KEY: envalid.str(),
      //
      SERVER_COOKIE_EXPIRES_SECOND: envalid.num(),
      //
      DB_TYPE: envalid.str({ choices: ['mysql'], default: 'mysql' }),
      DB_HOST: envalid.str(),
      DB_PORT: envalid.num(),
      DB_USERNAME: envalid.str(),
      DB_PASSWORD: envalid.str(),
      DB_DATABASE: envalid.str(),
      DB_SYNCHRONIZE: envalid.str(),
      //
      RATELIMIT_WINDOWMS: envalid.num(),
      RATELIMIT_MAX: envalid.num(),
      ENABLE_CAPTCHA_BY_LOGIN_FAILD_TIMES: envalid.num(),
      //
      ATTACHMENT_DIR: envalid.str(),
      ATTACHMENT_LIMIT_SIZE_MB: envalid.num(),
      ATTACHMENT_SAVE_IN_LOCAL: envalid.str({ choices: ['true', 'false'], default: 'false' }),
      ATTACHMENT_SAVE_IN_OSS: envalid.str({ choices: ['true', 'false'], default: 'false' }),
      //
      DEFAULT_IMAGE_FILENAME: envalid.str({ default: 'default-image.svg' }),
      DEFAULT_AVATAR_FILENAME: envalid.str({ default: 'default-avatar.svg' }),
      //
      //
      GRAVATAR_TYPE: envalid.str({
        choices: ['off', '404', 'mp', 'identicon', 'monsterid', 'wavatar', 'retro', 'robohash', 'blank'],
        default: 'off',
      }),
      AUTO_CUT_TAGS: envalid.str({ choices: ['true', 'false'], default: 'false' }),
    };

    return envalid.cleanEnv(process.env, rule, { dotEnvPath });
  }
}
