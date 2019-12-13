import envalid from 'envalid';

import { IDotEnv } from '@leaa/api/src/interfaces';

export class ConfigService {
  private readonly envConfig: IDotEnv;

  constructor(dotEnvPath: string) {
    this.envConfig = this.validate(dotEnvPath);
  }

  get PROTOCOL(): string {
    return this.envConfig.PROTOCOL;
  }

  get PORT(): number {
    return Number(this.envConfig.PORT);
  }

  get DEMO_MODE(): boolean {
    return Boolean(this.envConfig.DEMO_MODE === 'true');
  }

  get DEBUG_MODE(): boolean {
    return Boolean(this.envConfig.DEBUG_MODE === 'true');
  }

  get BASE_HOST(): string {
    return this.envConfig.BASE_HOST;
  }

  get PUBLIC_DIR(): string {
    return this.envConfig.PUBLIC_DIR;
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

  //

  get DB_TYPE(): string {
    return this.envConfig.DB_TYPE;
  }

  get DB_HOST(): string {
    return this.envConfig.DB_HOST;
  }

  get DB_PORT(): number {
    return Number(this.envConfig.DB_PORT);
  }

  get DB_USER(): string {
    return this.envConfig.DB_USER;
  }

  get DB_PASSWORD(): string {
    return this.envConfig.DB_PASSWORD;
  }

  get DB_DATABASE(): string {
    return this.envConfig.DB_DATABASE;
  }

  get DB_SYNCHRONIZE(): boolean {
    return typeof this.envConfig.DB_SYNCHRONIZE !== 'undefined'
      ? Boolean(this.envConfig.DB_SYNCHRONIZE === 'true')
      : true;
  }

  //

  get TRUST_PROXY(): string {
    return this.envConfig.DB_DATABASE;
  }

  get JWT_SECRET_KEY(): string {
    return this.envConfig.DB_DATABASE;
  }

  get CLIENT_COOKIE_EXPIRES_SECOND(): number {
    return Number(this.envConfig.CLIENT_COOKIE_EXPIRES_SECOND);
  }

  get SERVER_COOKIE_EXPIRES_SECOND(): number {
    return Number(this.envConfig.SERVER_COOKIE_EXPIRES_SECOND);
  }

  //

  get OSS_ALIYUN_BUCKET(): string {
    return this.envConfig.OSS_ALIYUN_BUCKET || '';
  }

  get OSS_ALIYUN_AK_SECRET(): string {
    return this.envConfig.OSS_ALIYUN_AK_SECRET || '';
  }

  get OSS_ALIYUN_AK_ID(): string {
    return this.envConfig.OSS_ALIYUN_AK_ID || '';
  }

  get OSS_ALIYUN_REGION(): string {
    return this.envConfig.OSS_ALIYUN_REGION || '';
  }

  get OSS_ALIYUN_CALLBACK_URL(): string {
    return this.envConfig.OSS_ALIYUN_CALLBACK_URL || '';
  }

  //

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

  get OAUTH_WECHAT_REDIRECT_URL(): string {
    return this.envConfig.OAUTH_WECHAT_REDIRECT_URL || '';
  }

  private validate(dotEnvPath: string): IDotEnv {
    const rule = {
      PROTOCOL: envalid.str({ choices: ['http', 'https'], default: 'http' }),
      PORT: envalid.port({ default: 5555 }),
      //
      DEMO_MODE: envalid.str({ choices: ['true', 'false'], default: 'false' }),
      DEBUG_MODE: envalid.str({ choices: ['true', 'false'], default: 'false' }),
      //
      BASE_HOST: envalid.str(),
      PUBLIC_DIR: envalid.str(),
      ATTACHMENT_DIR: envalid.str(),
      ATTACHMENT_LIMIT_SIZE_MB: envalid.num(),
      ATTACHMENT_SAVE_IN_LOCAL: envalid.str({ choices: ['true', 'false'], default: 'false' }),
      ATTACHMENT_SAVE_IN_OSS: envalid.str({ choices: ['true', 'false'], default: 'false' }),
      //
      DB_TYPE: envalid.str({ choices: ['mysql'], default: 'mysql' }),
      DB_HOST: envalid.str(),
      DB_PORT: envalid.num(),
      DB_USER: envalid.str(),
      DB_PASSWORD: envalid.str(),
      DB_DATABASE: envalid.str(),
      DB_SYNCHRONIZE: envalid.str(),
      //
      TRUST_PROXY: envalid.str(),
      JWT_SECRET_KEY: envalid.str(),
      CLIENT_COOKIE_EXPIRES_SECOND: envalid.num(),
      SERVER_COOKIE_EXPIRES_SECOND: envalid.num(),
      //
      // OSS_ALIYUN_BUCKET: envalid.str(),
      // OSS_ALIYUN_AK_SECRET: envalid.str(),
      // OSS_ALIYUN_AK_ID: envalid.str(),
      // OSS_ALIYUN_REGION: envalid.str(),
      // OSS_ALIYUN_ASSUME_ROLE: envalid.str(),
      //
      // OAUTH_WECHAT_APP_ID: envalid.str(),
      // OAUTH_WECHAT_APP_SECRET: envalid.str(),
      // OAUTH_WECHAT_MINIPROGRAM_APP_ID: envalid.str(),
      // OAUTH_WECHAT_MINIPROGRAM_APP_SECRET: envalid.str(),
      // OAUTH_WECHAT_TOKEN: envalid.str(),
      // OAUTH_WECHAT_REDIRECT_URL: envalid.str(),
    };

    return envalid.cleanEnv(process.env, rule, { dotEnvPath });
  }
}
