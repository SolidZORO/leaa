const _ = require('lodash');
const path = require('path');
const envalid = require('envalid');

const isServer = typeof window === 'undefined';

if (isServer) {
  const dev = process.env.NODE_ENV !== 'production';
  const rootPath = path.resolve(__dirname, '../');
  const dotEnvPath = dev ? `${rootPath}/.env` : `${rootPath}/.env.production`;

  const rule = {
    NAME: envalid.str(),
    PROTOCOL: envalid.str({ choices: ['http', 'https'], default: 'http' }),
    PORT: envalid.port({ default: 3333 }),
    BASE_HOST: envalid.str(),
    API_HOST: envalid.url(),
    GRAPHQL_ENDPOINT: envalid.url(),
  };

  const dotenvObject = envalid.cleanEnv(process.env, rule, { dotEnvPath });

  module.exports = _.pick(dotenvObject, Object.keys(rule));
}
