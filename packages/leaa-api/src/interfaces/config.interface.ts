export interface IDotEnv {
  PROTOCOL: string;
  PORT: number;

  BASE_HOST: string;
  PUBLIC_DIR: string;
  ATTACHMENT_DIR: string;
  ATTACHMENT_LIMIT_SIZE_BY_MB: number;
  ATTACHMENT_SAVED_IN_LOCAL: number;
  ATTACHMENT_SAVED_IN_CLOUD: number;

  DB_TYPE: string;
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
