const _ = require('lodash');
const envalid = require('envalid');

if (typeof window === 'undefined') {
  const rule = {
    NAME: envalid.str(),
    PROTOCOL: envalid.str({ choices: ['http', 'https'], default: 'http' }),
    PORT: envalid.port({ default: 3333 }),
    BASE_HOST: envalid.str(),
    API_HOST: envalid.url(),
    GRAPHQL_ENDPOINT: envalid.url(),
    UPLOAD_HOST: envalid.url(),
  };

  const dotenvObject = envalid.cleanEnv(process.env, rule);

  module.exports = _.pick(dotenvObject, Object.keys(rule));
}
