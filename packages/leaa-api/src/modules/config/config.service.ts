import Joi from 'joi';
import dotenv, { DotenvParseOutput } from 'dotenv';
import fs from 'fs';

import { IDotEnv } from '@leaa/api/interfaces';

type IEnvConfig = IDotEnv | DotenvParseOutput;

export class ConfigService {
  private readonly envConfig: IEnvConfig;

  constructor(path: string) {
    const config: IEnvConfig = dotenv.parse(fs.readFileSync(path));

    this.envConfig = this.validate(config);
  }

  get NODE_ENV(): string {
    return this.envConfig.NODE_ENV;
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

  private validate(envConfig: IEnvConfig): IEnvConfig {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      NODE_ENV: Joi.string()
        .valid(['development', 'production', 'test', 'provision'])
        .default('development'),
      //
      PROTOCOL: Joi.string().valid(['http', 'https']),
      PORT: Joi.number().default(3000),
      BASE_HOST: Joi.string(),
      PUBLIC_DIR: Joi.string().default('public'),
      ATTACHMENT_DIR: Joi.string().default('attachments'),
      ATTACHMENT_LIMIT_SIZE_BY_MB: Joi.number().default(5),
      //
      MYSQL_HOST: Joi.string(),
      MYSQL_PORT: Joi.number().default(3306),
      MYSQL_USER: Joi.string(),
      MYSQL_PASSWORD: Joi.string(),
      MYSQL_DATABASE: Joi.string(),

      TRUST_PROXY: Joi.string(),
      JWT_SECRET_KEY: Joi.string(),
      CLIENT_COOKIE_EXPIRES_DAY: Joi.number().default(180),
      SERVER_COOKIE_EXPIRES_DAY: Joi.number().default(180),
    });

    const { error, value: validatedEnvConfig } = Joi.validate(envConfig, envVarsSchema, { allowUnknown: true });

    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }

    return validatedEnvConfig;
  }
}
