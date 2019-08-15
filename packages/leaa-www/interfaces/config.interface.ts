export interface IDotEnvClient {
  NAME: string;
  NODE_ENV: 'development' | 'production';
  PROTOCOL: 'http' | 'https';
  PORT: number;

  BASE_HOST: string;
  API_HOST: string;
  GRAPHQL_ENDPOINT: string;

  LOCALE_SUBPATHS?: 'none' | 'foreign' | 'all';
}

export interface IDotEnvServer extends IDotEnvClient {
  JWT_KEY?: string;
}
