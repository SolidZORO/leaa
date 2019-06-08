export interface IDotEnv {
  // NAME: string;
  // MODE: 'DEV' | 'PROD';
  // DEBUG: boolean;
  // VERSION: string;
  NODE_ENV: 'development' | 'production' | 'test';
  PROTOCOL: 'http' | 'https';
  PORT: number;
  //
  BASE_HOST: string;
  // API_HOST: string;
  // CDN_HOST: string;
  //
  // CLIENT_COOKIE_EXPIRES_TIME: number; // DAY
  // SERVER_COOKIE_EXPIRES_TIME: number; // DAY
  // TRUST_PROXY: string;
  //
  // BASE_URL: string;
  // API_URL: string;
  // CDN_URL: string;
  //
  // LOG_LEVEL: 'info' | 'trace' | 'warn'  | 'error'  | 'debug'  | 'fatal';
  //
  MYSQL_HOST: string;
  MYSQL_PORT: number;
  MYSQL_USER: string;
  MYSQL_PASSWORD: string;
  MYSQL_DATABASE: string;
  //
  // JWT_SECRET_KEY: string;
}
