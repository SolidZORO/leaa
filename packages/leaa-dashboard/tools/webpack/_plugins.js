/* eslint-disable no-underscore-dangle, max-len */
const moment = require('moment');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
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

const { showEnvInfo, getGitVersion } = require('./_fn');
const { WPCONST } = require('./_const');
const { analyzer } = require('./_analyzer');
const { provide } = require('./_provide');

class ShowEnvInfoWebpackPlugin {
  apply(compiler) {
    compiler.hooks.done.tap('ShowEnvInfoWebpackPlugin', () => showEnvInfo());
  }
}

// HtmlWebpackPlugin
const htmlWebpackPluginOption = {
  __ENV_FILE__: WPCONST.ENV_FILE_NAME,
  __BUILD_DATA__: Buffer.from(
    JSON.stringify({
      VERSION: `v${process.env.npm_package_version}`,
      VERSION_SLUG: `v${process.env.npm_package_version}-${getGitVersion}`,
      MODE: WPCONST.MODE,
      BUILDTIME: moment().format('YYYYMMDD-HHmmss'),
      GIT_VERSION: getGitVersion,
    }),
  ).toString('base64'),
  title: `${WPCONST.SITE_NAME || '-'}`,
  manifest: `${WPCONST.OUTPUT_PUBLIC_PATH}manifest.json`,
  filename: `${WPCONST.BUILD_DIR}/index.html`,
  template: `${WPCONST.VIEWS_DIR}/index.ejs`,
  favicon: `${WPCONST.SRC_DIR}/assets/favicons/favicon.ico`,
  inject: true,
  hash: true,
  version_hash: `v${process.env.npm_package_version}-${getGitVersion}`,
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
  new webpack.ProvidePlugin(provide),
  new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn/),
  new HtmlWebpackPlugin(htmlWebpackPluginOption),
  new LodashModuleReplacementPlugin(lodashModuleReplacementPluginOption),
  // new CaseSensitivePathsPlugin(),
  new ManifestPlugin(),
  new ShowEnvInfoWebpackPlugin(),
  new WriteFilePlugin(),
  // new WriteFilePlugin({
  //   test: /(index\.html$|robots\.txt|\/assets\/|\/libs\/)/,
  //   useHashIndex: true,
  // }),
  new CopyPlugin({
    patterns: [
      {
        from: `${WPCONST.PUBLIC_DIR}/assets/**/*`,
        to: WPCONST.BUILD_DIR,
        transformPath(targetPath) {
          return `${targetPath}`.replace('public/', '');
        },
        cacheTransform: true,
      },
      {
        from: WPCONST.ENV_FILE_PATH,
        to: WPCONST.BUILD_DIR,
        transformPath(targetPath) {
          return `${targetPath}`.replace('public/', '');
        },
        cacheTransform: true,
      },
    ],
  }),

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
