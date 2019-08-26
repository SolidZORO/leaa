require('dotenv').config();

const path = require('path');
const Dotenv = require('dotenv-webpack');
const dotenvObject = require('./next-dotenv-object');

const dev = process.env.NODE_ENV !== 'production';
const rootPath = path.resolve(__dirname, '../');
const dotEnvPath = dev ? `${rootPath}/.env` : `${rootPath}/.env.production`;

module.exports = nextConfig => ({
  ...nextConfig,
  publicRuntimeConfig: dotenvObject,
  // serverRuntimeConfig: dotenvObject,
  webpack(config, options) {
    config.plugins.push(
      new Dotenv({
        path: dotEnvPath,
        systemvars: true,
      }),
    );

    if (typeof nextConfig.webpack === 'function') {
      return nextConfig.webpack(config, options);
    }

    return config;
  },
});
