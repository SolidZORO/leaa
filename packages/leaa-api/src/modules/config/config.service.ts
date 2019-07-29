import envalid from 'envalid';

import { IDotEnv } from '@leaa/api/interfaces';

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

  get BASE_HOST(): string {
    return this.envConfig.BASE_HOST;
  }

  get PUBLIC_DIR(): string {
    return this.envConfig.PUBLIC_DIR;
  }

  get ATTACHMENT_DIR(): string {
    return this.envConfig.ATTACHMENT_DIR;
  }

  get ATTACHMENT_LIMIT_SIZE_BY_MB(): number {
    return Number(this.envConfig.ATTACHMENT_LIMIT_SIZE_BY_MB);
  }

  //

  get MYSQL_HOST(): string {
    return this.envConfig.MYSQL_HOST;
  }

  get MYSQL_PORT(): number {
    return Number(this.envConfig.MYSQL_PORT);
  }

  get MYSQL_USER(): string {
    return this.envConfig.MYSQL_USER;
  }

  get MYSQL_PASSWORD(): string {
    return this.envConfig.MYSQL_PASSWORD;
  }

  get MYSQL_DATABASE(): string {
    return this.envConfig.MYSQL_DATABASE;
  }

  get TRUST_PROXY(): string {
    return this.envConfig.MYSQL_DATABASE;
  }

  get JWT_SECRET_KEY(): string {
    return this.envConfig.MYSQL_DATABASE;
  }

  get CLIENT_COOKIE_EXPIRES_DAY(): number {
    return Number(this.envConfig.CLIENT_COOKIE_EXPIRES_DAY);
  }

  get SERVER_COOKIE_EXPIRES_DAY(): number {
    return Number(this.envConfig.SERVER_COOKIE_EXPIRES_DAY);
  }

  private validate(dotEnvPath: string): IDotEnv {
    const rule = {
      PROTOCOL: envalid.str({ choices: ['http', 'https'], default: 'http' }),
      PORT: envalid.port({ default: 5555 }),
      //
      BASE_HOST: envalid.str(),
      PUBLIC_DIR: envalid.str(),
      ATTACHMENT_DIR: envalid.str(),
      ATTACHMENT_LIMIT_SIZE_BY_MB: envalid.num(),
      ATTACHMENT_SAVED_IN_LOCAL: envalid.num({ choices: [0, 1], default: 0 }),
      ATTACHMENT_SAVED_IN_CLOUD: envalid.num({ choices: [0, 1], default: 0 }),
      //
      MYSQL_HOST: envalid.str(),
      MYSQL_PORT: envalid.num(),
      MYSQL_USER: envalid.str(),
      MYSQL_PASSWORD: envalid.str(),
      MYSQL_DATABASE: envalid.str(),
      //
      TRUST_PROXY: envalid.str(),
      JWT_SECRET_KEY: envalid.str(),
      CLIENT_COOKIE_EXPIRES_DAY: envalid.num(),
      SERVER_COOKIE_EXPIRES_DAY: envalid.num(),
    };

    // @ts-ignore
    return envalid.cleanEnv(process.env, rule, { dotEnvPath });
  }
}
