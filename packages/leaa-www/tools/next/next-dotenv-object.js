const path = require('path');
const dotenv = require('dotenv');

const dev = process.env.NODE_ENV !== 'production';
const rootPath = path.resolve(__dirname, '../../');

const dotEnvPath = dev ? `${rootPath}/.env` : `${rootPath}/.env.production`;

dotenv.config({ path: dotEnvPath });

module.exports = {
  DEMO_MODE: Boolean(process.env.DEMO_MODE === 'true'),
  DEBUG_MODE: Boolean(process.env.DEBUG_MODE === 'true'),

  SITE_NAME: process.env.SITE_NAME,
  MODE: process.env.MODE,
  SERVER_PROTOCOL: process.env.SERVER_PROTOCOL,
  SERVER_PORT: process.env.SERVER_PORT,
  SERVER_HOST: process.env.SERVER_HOST,
  //
  API_URL: process.env.API_URL,
  GRAPHQL_ENDPOINT: process.env.GRAPHQL_ENDPOINT,
  //
  ANALYTICS_CODE: process.env.ANALYTICS_CODE,
  //
  OAUTH_WECHAT_BASE_URL: process.env.OAUTH_WECHAT_BASE_URL,
};
