const _ = require('lodash');
const dotenv = require('dotenv');

const dotenvParsed = dotenv.config().parsed;
const dotenvObject = require('./next-dotenv-object');

module.exports = nextConfig => ({
  ...nextConfig,
  ...{
    publicRuntimeConfig: _.pick(dotenvObject, Object.keys(dotenvParsed)),
  },
});
