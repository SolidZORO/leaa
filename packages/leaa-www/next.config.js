/* eslint-disable */
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const lessToJS = require('less-vars-to-js');
// const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');

const withImage = require('./__next__/next-image');
const withDotenv = require('./__next__/next-dotenv');
const withAntd = require('./__next__/next-antd');

const antdVariables = lessToJS(fs.readFileSync(path.resolve(__dirname, './styles/variables.less'), 'utf8'));

// fix: prevents error when .less files are required by node
if (typeof require !== 'undefined') {
  require.extensions['.less'] = file => {};
}

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
      webpack: config => {
        config.plugins.push(
          new webpack.NormalModuleReplacementPlugin(
            /\/eventsource$/,
            path.resolve(__dirname, './__next__/next-eventsource.js'),
          ),
        );

        // comstom antd icon
        config.resolve.alias['@ant-design/icons/lib/dist$'] = path.resolve(__dirname, './__next__/next-antd-icon');
        config.resolve.alias['swiper$'] = 'swiper/dist/js/swiper.js';

        return config;
      },
    }),
  ),
);
