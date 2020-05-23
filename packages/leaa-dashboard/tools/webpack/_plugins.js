/* eslint-disable no-underscore-dangle, max-len */
const _ = require('lodash');
const dotenv = require('dotenv');
const moment = require('moment');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const ModuleNotFoundPlugin = require('react-dev-utils/ModuleNotFoundPlugin');
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
// const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');

const { WPCONST } = require('./_const');
const { analyzer } = require('./_analyzer');
const { provide } = require('./_provide');

const envPath = `${WPCONST.ROOT_DIR}/${WPCONST.__DEV__ ? '.env' : '.env.production'}`;
const env = dotenv.config({ path: envPath }).parsed;

// HtmlWebpackPlugin
const htmlWebpackPluginOption = {
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
  manifest: `${WPCONST.CDN_DIR_PATH}/manifest.json`,
  filename: `${WPCONST.BUILD_PUBLIC_DIR}/index.html`,
  template: `${WPCONST.VIEWS_DIR}/index.ejs`,
  favicon: `${WPCONST.SRC_DIR}/assets/favicons/favicon.ico`,
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
};

// LodashModuleReplacementPlugin
const lodashModuleReplacementPluginOption = {
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
};

const plugins = [
  // new WriteFilePlugin(),
  new WriteFilePlugin({ test: /(favicon\.ico$|index\.html$|robots\.|\/assets\/|\/libs\/)/, useHashIndex: true }),
  new webpack.ProvidePlugin(provide),
  new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn/),
  new HtmlWebpackPlugin(htmlWebpackPluginOption),
  new LodashModuleReplacementPlugin(lodashModuleReplacementPluginOption),
  // new CaseSensitivePathsPlugin(),
  new ManifestPlugin(),

  //
  // DEV ONLY
  WPCONST.__DEV__ && new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify('development'), __DEV__: true }),
  WPCONST.__DEV__ && new webpack.NamedChunksPlugin(),
  WPCONST.__DEV__ && new ModuleNotFoundPlugin(WPCONST.ROOT_DIR),
  WPCONST.__DEV__ && new WatchMissingNodeModulesPlugin(WPCONST.NODEMODULES_DIR),

  //
  // PROD ONLY
  WPCONST.__PROD__ && new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify('production'), __DEV__: false }), // prettier-ignore
  WPCONST.__PROD__ && new MiniCssExtractPlugin({ filename: WPCONST.OUTPUT_STYLE_FILENAME, chunkFilename: WPCONST.OUTPUT_STYLE_CHUNK_FILENAME }), // prettier-ignore
  WPCONST.__PROD__ && new webpack.HashedModuleIdsPlugin(),
  WPCONST.__PROD__ && new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime-.+[.]js/]),

  //
  // ANALYZER
  WPCONST.IS_ANALYZER && new BundleAnalyzerPlugin(analyzer),
].filter(Boolean);

module.exports = { plugins };
