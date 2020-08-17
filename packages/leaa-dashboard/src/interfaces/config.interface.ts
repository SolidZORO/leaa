export interface IDotEnv {
  __ENV__: 'prod' | 'dev';
  //
  SITE_NAME: string;
  API_URL: string;
  API_VERSION: string;
  //
  ROUTER_BASENAME: string;
  PRIMARY_ACCOUNT_TYPE: 'email' | 'phone';
  LOGO_BLACK_FILENAME: string;
  LOGO_WHITE_FILENAME: string;
  ANALYTICS_CODE: string;
  //
  DEMO_MODE: boolean;
  DEBUG_MODE: boolean;
  SERVER_PROTOCOL: 'http' | 'https';
  SERVER_PORT: number;
  SERVER_HOST: string;
}

export interface ISetting {
  name: string;
  slug: string;
  value: string;
}

export interface IBuild {
  MODE: string;
  VERSION: string;
  BUILDTIME: string;
  VERSION_HASH: string;
  VERSION_SLUG: string;
}
