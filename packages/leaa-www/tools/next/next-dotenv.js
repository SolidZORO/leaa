const dotenvObject = require('./next-dotenv-object');

module.exports = (nextConfig) => ({
  ...nextConfig,
  // publicRuntimeConfig: dotenvObject,
  // serverRuntimeConfig: dotenvObject,
});
