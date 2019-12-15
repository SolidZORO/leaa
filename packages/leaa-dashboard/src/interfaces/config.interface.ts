export interface IDotEnv {
  SITE_NAME: string;
  PROTOCOL: 'http' | 'https';
  PORT: number;
  BASE_HOST: string;
  API_HOST: string;
  GRAPHQL_ENDPOINT: string;
  ANALYTICS_CODE: string;
}

export interface ISetting {
  name: string;
  slug: string;
  value: string;
}

export interface IBuild {
  MODE: string;
  VERSION: string;
  TIMESTAMP: string;
}
