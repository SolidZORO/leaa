const env = require('./next-dotenv-parsed');

module.exports = nextConfig => ({
  ...nextConfig,
  ...{
    publicRuntimeConfig: env,
  },
});
