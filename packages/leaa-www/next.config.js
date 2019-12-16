/* eslint-disable */
const path = require('path');
const webpack = require('webpack');
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');

const withDotenv = require('@leaa/www/tools/next/next-dotenv');
const withImage = require('@leaa/www/tools/next/next-image');
const withAntdStyle = require('@leaa/www/tools/next/next-antd-style');

const env = require('@leaa/www/tools/next/next-dotenv-object');

// fix: prevents error when .less files are required by node
if (typeof require !== 'undefined') {
  require.extensions['.less'] = file => {};
}

const webpackConfig = (config, options) => {
  config.plugins.push(
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn|en/),
    new webpack.NormalModuleReplacementPlugin(
      // ⚠️ fixed wechat HMR (replace mod eventsource.js)
      /\/eventsource$/,
      path.resolve(__dirname, './tools/next/next-eventsource.js'),
    ),
    new FilterWarningsPlugin({
      // ignore ANTD chunk styles [mini-css-extract-plugin] warning
      exclude: /Conflicting order between:/,
    }),
  );

  // comstom antd icon
  // config.resolve.alias['@ant-design/icons/lib/dist$'] = path.resolve(__dirname, './tools/next/next-antd-icon');
  config.resolve.alias['swiper$'] = 'swiper/js/swiper.js';

  config.node = {
    fs: 'empty',
  };

  return config;
};

const nextConfig = {
  env,
  target: 'server',
  // target: 'serverless',
  // exportTrailingSlash: true,
};

module.exports = withDotenv(
  withImage(
    withAntdStyle({
      webpack: webpackConfig,
      ...nextConfig,
    }),
  ),
);
