/* eslint-disable max-len */
const moment = require('moment');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const { getPkgVersion } = require('./__fn');
const { ENV_DATA, WPCONST } = require('./_const');

const htmlMinify = {
  collapseWhitespace: true,
  collapseBooleanAttributes: true,
  collapseInlineTagWhitespace: true,
  removeComments: true,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  minifyCSS: true,
  minifyJS: true,
  minifyURLs: true,
  useShortDoctype: true,
};

module.exports = {
  htmlPlugins: [
    new HtmlWebpackPlugin({
      title: `${WPCONST.SITE_NAME || '-'}`,
      filename: `${WPCONST.BUILD_DIR}/index.html`,
      template: `${WPCONST.PAGES_DIR}/_document.ejs`,
      favicon: `${WPCONST.SRC_DIR}/assets/favicons/favicon.svg`,
      inject: true,
      hash: true,
      minify: WPCONST.__PROD__ ? htmlMinify : false,
      __ENV_FILE__: `${WPCONST.ROUTER_BASENAME}/${WPCONST.ENV_FILE_NAME}`,
      __ENV_DATA__: JSON.stringify(ENV_DATA),
      __BUILD_DATA__: JSON.stringify({
        MODE: WPCONST.MODE,
        ...getPkgVersion,
        BUILDTIME: moment().format('YYYYMMDD-HHmmss'),
      }),
    }),
  ].filter(Boolean),
};
