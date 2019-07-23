export interface IDotEnvClient {
  NAME: string;
  NODE_ENV: 'development' | 'production' | 'test';
  PROTOCOL: 'http' | 'https';
  PORT: number;

  BASE_HOST: string;
  API_HOST: string;
  GRAPHQL_ENDPOINT: string;
  UPLOAD_HOST: string;
}

export interface IDotEnvServer {
  // JWT_KEY: string;
}
