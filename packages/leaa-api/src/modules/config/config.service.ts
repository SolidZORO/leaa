import envalid from 'envalid';
import { DatabaseType } from 'typeorm';

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

  get DB_TYPE(): DatabaseType {
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

  get TRUST_PROXY(): string {
    return this.envConfig.DB_DATABASE;
  }

  get JWT_SECRET_KEY(): string {
    return this.envConfig.DB_DATABASE;
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
      DB_TYPE: envalid.str({ choices: ['mysql', 'postgres'], default: 'mysql' }),
      DB_HOST: envalid.str(),
      DB_PORT: envalid.num(),
      DB_USER: envalid.str(),
      DB_PASSWORD: envalid.str(),
      DB_DATABASE: envalid.str(),
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
