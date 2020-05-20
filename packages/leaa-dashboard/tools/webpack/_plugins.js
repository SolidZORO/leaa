const _ = require('lodash');
const dotenv = require('dotenv');
const moment = require('moment');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

const { WPCONST } = require('./_const');
const { analyzer } = require('./_analyzer');
const { provide } = require('./_provide');

const envPath = `${WPCONST.ROOT_DIR}/${WPCONST.__DEV__ ? '.env' : '.env.production'}`;
const env = dotenv.config({ path: envPath }).parsed;

// PLUGIN
const plugins = [];

if (WPCONST.IS_ANALYZER) {
  plugins.push(new BundleAnalyzerPlugin(analyzer));
}

// OUTPUT HTML
const outputHtmlOption = {
  title: `${process.env.SITE_NAME || '-'}`,
  env: Buffer.from(JSON.stringify(_.pick(env, Object.keys(env)))).toString('base64'),
  analytics_code: (!WPCONST.__DEV__ && env && env.ANALYTICS_CODE && `<script>${env.ANALYTICS_CODE}</script>`) || '',
  build: Buffer.from(
    JSON.stringify({
      BUILDTIME: moment().format('YYYYMMDD-HHmmss'),
      VERSION: `v${process.env.npm_package_version}`,
      MODE: WPCONST.MODE,
    }),
  ).toString('base64'),
  filename: `${WPCONST.BUILD_PUBLIC_DIR}/index.html`,
  template: `${WPCONST.VIEWS_DIR}/index.ejs`,
  favicon: `${WPCONST.SRC_DIR}/assets/favicons/favicon.ico`,
  inject: true,
  hash: true,
  minify: {
    removeComments: true,
    collapseWhitespace: false,
  },
};

plugins.push(
  // new WriteFilePlugin(),
  new WriteFilePlugin({ test: /(favicon\.ico$|index\.html$|robots\.|\/assets\/|\/libs\/)/, useHashIndex: true }),
  new webpack.ProvidePlugin(provide),
  new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn/),
  new HtmlWebpackPlugin(outputHtmlOption),
  new LodashModuleReplacementPlugin({
    shorthands: true, // for _.groupBy
    // cloning: true,
    // currying: true,
    // caching: true,
    collections: true,
    // exotics: true,
    // guards: true,
    // metadata: true,
    // deburring: true,
    // unicode: true,
    // chaining: true,
    // memoizing: true,
    // coercions: true,
    // flattening: true,
    // paths: true,
    // placeholders: true,
  }),
);

if (WPCONST.__DEV__) {
  plugins.push(
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
      __DEV__: true,
    }),
    new webpack.NamedChunksPlugin(),
  );
} else {
  plugins.push(
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      __DEV__: false,
    }),
    new webpack.HashedModuleIdsPlugin(),
    new MiniCssExtractPlugin({
      filename: WPCONST.OUTPUT_STYLE_FILENAME,
      chunkFilename: WPCONST.OUTPUT_STYLE_CHUNK_FILENAME,
    }),
  );
}

module.exports = { plugins };
