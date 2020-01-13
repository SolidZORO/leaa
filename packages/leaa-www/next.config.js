const env = require('./tools/next/next-dotenv-object');
const withWebpack = require('./tools/next/next-webpack');

// fix: prevents error when .less files are required by node
if (typeof require !== 'undefined') {
  require.extensions['.less'] = file => {};
}

const nextConfig = {
  env,
  target: 'server',
  poweredByHeader: false,
  // useFileSystemPublicRoutes: false,
};

module.exports = { ...nextConfig, webpack: withWebpack };
