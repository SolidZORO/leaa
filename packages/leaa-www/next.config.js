/* eslint-disable */
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const lessToJS = require('less-vars-to-js');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

const withImage = require('./configs/next-image');
const withDotenv = require('./configs/next-dotenv');
const withAntd = require('./configs/next-antd');

const env = require('./configs/next-dotenv-object');
const antdVariables = lessToJS(fs.readFileSync(path.resolve(__dirname, './styles/variables.less'), 'utf8'));

// fix: prevents error when .less files are required by node
if (typeof require !== 'undefined') {
  require.extensions['.less'] = file => {};
}

const webpackConfig = config => {
  config.plugins.push(
    new LodashModuleReplacementPlugin({ paths: true }),
    new webpack.NormalModuleReplacementPlugin(
      /\/eventsource$/,
      path.resolve(__dirname, './configs/next-eventsource.js'),
    ),
  );

  // comstom antd icon
  config.resolve.alias['@ant-design/icons/lib/dist$'] = path.resolve(__dirname, './configs/next-antd-icon');
  config.resolve.alias['swiper$'] = 'swiper/dist/js/swiper.js';

  return config;
};

module.exports = withDotenv(
  withImage(
    withAntd({
      cssModules: true,
      cssLoaderOptions: {
        sourceMap: false,
        importLoaders: 1,
        localIdentName: '[local]--[hash:8]',
      },
      lessLoaderOptions: {
        javascriptEnabled: true,
        modifyVars: antdVariables,
      },
      // target: 'serverless',
      // distDir: process.env.NODE_ENV !== 'production' ? '.next' : '_dist',
      // assetPrefix: './',
      env,
      webpack: webpackConfig,
    }),
  ),
);
