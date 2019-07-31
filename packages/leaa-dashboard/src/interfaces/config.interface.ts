export interface IDotEnv {
  SITE_NAME: string;
  PROTOCOL: 'http' | 'https';
  PORT: number;
  BASE_HOST: string;
  API_HOST: string;
  GRAPHQL_ENDPOINT: string;
  UPLOAD_ENDPOINT: string;
}
