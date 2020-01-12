export interface IDotEnvClient {
  DEMO_MODE?: boolean;
  DEBUG_MODE?: boolean;

  SITE_NAME?: string;
  MODE?: 'production' | 'development' | 'test' | 'demo';
  NODE_ENV?: string;
  PROTOCOL?: string;
  PORT?: number;

  BASE_HOST?: string;
  API_HOST?: string;
  GRAPHQL_ENDPOINT?: string;

  OAUTH_WECHAT_BASE_URL?: string;
  LOCALE_SUBPATHS?: string;
  ANALYTICS_CODE?: string;
}

export interface IDotEnvServer extends IDotEnvClient {
  JWT_KEY?: string;
}
