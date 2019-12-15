const _ = require('lodash');
const path = require('path');
const dotenv = require('dotenv');

const dev = process.env.NODE_ENV !== 'production';
const rootPath = path.resolve(__dirname, '../../');

const dotEnvPath = dev ? `${rootPath}/.env` : `${rootPath}/.env.production`;

dotenv.config({ path: dotEnvPath });

module.exports = {
  NAME: process.env.NAME,
  MODE: process.env.MODE,
  PROTOCOL: process.env.PROTOCOL,
  PORT: process.env.PORT,
  BASE_HOST: process.env.BASE_HOST,
  //
  API_HOST: process.env.API_HOST,
  GRAPHQL_ENDPOINT: process.env.GRAPHQL_ENDPOINT,
  //
  ANALYTICS_CODE: process.env.ANALYTICS_CODE,
  //
  OAUTH_WECHAT_BASE_URL: process.env.OAUTH_WECHAT_BASE_URL,
};
