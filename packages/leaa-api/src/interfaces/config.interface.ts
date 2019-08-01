import { DatabaseType } from 'typeorm';

export interface IDotEnv {
  PROTOCOL: 'http' | 'https';
  PORT: number;

  BASE_HOST: string;
  PUBLIC_DIR: string;
  ATTACHMENT_DIR: string;
  ATTACHMENT_LIMIT_SIZE_BY_MB: number;
  ATTACHMENT_SAVED_IN_LOCAL: 0 | 1;
  ATTACHMENT_SAVED_IN_CLOUD: 0 | 1;

  DB_TYPE: DatabaseType;
  DB_HOST: string;
  DB_PORT: number;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_DATABASE: string;

  TRUST_PROXY: string;
  JWT_SECRET_KEY: string;
  CLIENT_COOKIE_EXPIRES_DAY: number;
  SERVER_COOKIE_EXPIRES_DAY: number;
}
