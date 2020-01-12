const _ = require('lodash');
const webpack = require('webpack');
const dotenv = require('dotenv');
const moment = require('moment');
// const Dotenv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const webpackAnalyzerConfig = require('./_webpack_analyzer');
const webpackConst = require('./_webpack_const');
const webpackShimming = require('./_webpack_shimming');

const envPath = `${webpackConst.ROOT_DIR}/${webpackConst.__DEV__ ? '.env' : '.env.production'}`;
const env = dotenv.config({ path: envPath }).parsed;
const pkg = require(webpackConst.PACKAGE_FILE);

class WebpackCallbackPlugin {
  apply(compiler) {
    compiler.hooks.done.tap('WebpackCallbackPlugin', () => {
      if (webpackConst.IS_SERVER) {
        // emoji for CLI
        const serverBaseByText = `${process.env.PROTOCOL}://${process.env.BASE_HOST}:${process.env.PORT}`;
        const serverBaseByEmoji = `✨✨ \x1b[00;45;9m${serverBaseByText}\x1b[0m ✨✨`;
        const serverEnv = `${process.env.NODE_ENV !== 'production' ? '🚀' : '🔰'} ${(
          process.env.NODE_ENV || 'NOT-ENV'
        ).toUpperCase()}`;

        console.log(
          `\n\n\n\n> 🌈 DEBUG ${env.DEBUG_MODE === 'true' ? '✅' : '➖'} / DEMO ${
            env.DEMO_MODE === 'true' ? '✅' : '➖'
          }`,
        );

        console.log(`\n\n> ${serverEnv} / URL ${serverBaseByEmoji}`);

        console.log('\n> 📮 ENVDATA');
        console.log('     - NAME             ', `${env.SITE_NAME}`);
        console.log('     - VERSION          ', `v${pkg.version}`);
        console.log('     - GRAPHQL_ENDPOINT ', `${env.GRAPHQL_ENDPOINT}`);
        console.log('');
        console.log('     - DEV_PREFIX       ', `${webpackConst.DEV_PREFIX}`);
        console.log('     - CHUNK_HASH       ', `${webpackConst.CHUNK_HASH}`);
        console.log('     - PUBLIC_DIR       ', `${webpackConst.PUBLIC_DIR}`);
        console.log('     - BUILD_DIR        ', `${webpackConst.BUILD_DIR}`);
        console.log('\n\n\n');
      }
    });
  }
}

// PLUGIN
const pluginList = [];

if (webpackConst.IS_ANALYZER) {
  pluginList.push(new BundleAnalyzerPlugin(webpackAnalyzerConfig));
}

// OUTPUT HTML
const outputHtmlOption = {
  title: `${process.env.SITE_NAME || '-'}`,
  env: Buffer.from(JSON.stringify(_.pick(env, Object.keys(env)))).toString('base64'),
  analytics_code:
    (!webpackConst.__DEV__ && env && env.ANALYTICS_CODE && `<script>${env.ANALYTICS_CODE}</script>`) || '',
  build: Buffer.from(
    JSON.stringify({
      TIMESTAMP: moment().format('YYYYMMDD-HHmmss'),
      VERSION: pkg.version,
      MODE: webpackConst.MODE,
    }),
  ).toString('base64'),
  filename: `${webpackConst.BUILD_PUBLIC_DIR}/index.html`,
  template: `${webpackConst.VIEWS_DIR}/index.ejs`,
  favicon: `${webpackConst.SRC_DIR}/assets/favicons/favicon.ico`,
  inject: true,
  hash: true,
  minify: {
    removeComments: true,
    collapseWhitespace: false,
  },
};

pluginList.push(
  new WriteFilePlugin({
    test: /(favicon\.ico$|index\.html$|\/assets\/)/,
    useHashIndex: true,
  }),
  // new SizePlugin(),
  new webpack.ProvidePlugin(webpackShimming.provide),
  new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn|zh-hk|en/),
  new HtmlWebpackPlugin(outputHtmlOption),
);

if (webpackConst.__DEV__) {
  pluginList.push(
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify('development') }),
    new webpack.NamedChunksPlugin(),
    new WebpackCallbackPlugin(),
  );
} else {
  pluginList.push(
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify('production') }),
    new webpack.HashedModuleIdsPlugin(),
    new MiniCssExtractPlugin({
      filename: webpackConst.OUTPUT_STYLE_FILENAME,
      chunkFilename: webpackConst.OUTPUT_STYLE_CHUNK_FILENAME,
    }),
  );
}

module.exports = pluginList;
