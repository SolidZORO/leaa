/* eslint-disable max-len */
const moment = require('moment');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const { getPkgVersion } = require('./__fn');
const { ENV_DATA, WPCONST } = require('./_const');

module.exports = {
  htmlPlugins: [
    new HtmlWebpackPlugin({
      title: `${WPCONST.SITE_NAME || '-'}`,
      filename: `${WPCONST.BUILD_DIR}/index.html`,
      template: `${WPCONST.PAGES_DIR}/_document.ejs`,
      favicon: `${WPCONST.SRC_DIR}/assets/favicons/favicon.svg`,
      inject: true,
      hash: true,
      minify: WPCONST.__PROD__
        ? {
            removeComments: true,
            collapseWhitespace: true,
            removeRedundantAttributes: true,
            useShortDoctype: true,
            removeEmptyAttributes: true,
            removeStyleLinkTypeAttributes: true,
            keepClosingSlash: true,
            minifyJS: true,
            minifyCSS: true,
            minifyURLs: true,
          }
        : false,
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
