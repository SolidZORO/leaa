const envalid = require('envalid');

if (typeof window === 'undefined') {
  module.exports = envalid.cleanEnv(process.env, {
    NAME: envalid.str(),
    NODE_ENV: envalid.str({ choices: ['development', 'production', 'test'], default: 'development' }),
    PROTOCOL: envalid.str({ choices: ['http', 'https'], default: 'http' }),
    PORT: envalid.port({ default: 3333 }),
    BASE_HOST: envalid.str(),
    API_HOST: envalid.url(),
    GRAPHQL_ENDPOINT: envalid.url(),
    UPLOAD_HOST: envalid.url(),
  });
}
