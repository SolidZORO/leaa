const path = require('path');
const dotenv = require('dotenv');

const rootPath = path.resolve(__dirname, '../');
const envPath = process.env.NODE_ENV !== 'production' ? `${rootPath}/.env` : `${rootPath}/.env.production`;
const envFile = dotenv.config({ path: envPath }).parsed;

const env = {
  NAME: envFile.NAME || process.env.NAME || '',
  // NODE_ENV: envFile.NODE_ENV || process.env.NAME || 'development',
  PROTOCOL: envFile.PROTOCOL || process.env.PROTOCOL || 'http',
  PORT: Number(envFile.PORT) || Number(process.env.PORT) || 3333,
  //
  BASE_HOST: envFile.BASE_HOST || process.env.BASE_HOST || 'localhost',
  API_HOST: envFile.API_HOST || process.env.API_HOST || 'http://localhost:5555',
  GRAPHQL_ENDPOINT: envFile.GRAPHQL_ENDPOINT || process.env.GRAPHQL_ENDPOINT || 'http://localhost:5555/graphql',
  UPLOAD_HOST: envFile.UPLOAD_HOST || process.env.UPLOAD_HOST || 'http://localhost:5555/attachments',
  //
  LOCALE_SUBPATHS: typeof envFile.LOCALE_SUBPATHS === 'string' ? envFile.LOCALE_SUBPATHS : 'none',
};

module.exports = env;
