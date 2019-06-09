export interface IDotEnv {
  NODE_ENV: 'development' | 'production' | 'test';
  PROTOCOL: 'http' | 'https';
  PORT: number;

  BASE_HOST: string;

  MYSQL_HOST: string;
  MYSQL_PORT: number;
  MYSQL_USER: string;
  MYSQL_PASSWORD: string;
  MYSQL_DATABASE: string;

  TRUST_PROXY: string;
  JWT_SECRET_KEY: string;
  CLIENT_COOKIE_EXPIRES_DAY: number;
  SERVER_COOKIE_EXPIRES_DAY: number;
}
