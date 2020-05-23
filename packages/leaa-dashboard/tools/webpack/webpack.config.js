/* eslint-disable no-underscore-dangle */
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');

const { WPCONST } = require('./_const');
const { modules } = require('./_modules');
const { plugins } = require('./_plugins');
//
const { stats } = require('./_stats');
const { resolve } = require('./_resolve');
const { externals } = require('./_externals');
const { devServer } = require('./_devServer');
const { optimization } = require('./_optimization');
const { showEnvInfo } = require('./_fn');

// @see https://webpack.docschina.org/configuration/devtool/
let webpackConfig = {
  entry: { index: './src/index.tsx' },
  context: WPCONST.ROOT_DIR,
  mode: WPCONST.MODE,
  watch: WPCONST.IS_SERVER,
  devtool: WPCONST.DEVTOOL,
  cache: WPCONST.__DEV__,
  // Stop compilation early in production
  bail: WPCONST.__PROD__,
  //
  stats,
  devServer,
  resolve,
  module: modules,
  plugins,
  externals,
  optimization,
  output: {
    // # for Lib
    // filename: 'x.js',
    // library: 'X',
    // libraryTarget: 'umd',
    // libraryExport: 'default',
    // umdNamedDefine: true,

    // # for Project
    pathinfo: WPCONST.__DEV__,
    path: WPCONST.__PROD__ ? WPCONST.BUILD_STATICS_DIR : undefined,
    // webpack uses `publicPath` to determine where the app is being served from.
    // It requires a trailing slash, or the file assets will get an incorrect path.
    // We inferred the "public path" (such as / or /my-project) from homepage.
    publicPath: WPCONST.CDN_DIR_PATH,
    // futureEmitAssets: true,
    // There will be one main bundle, and one file per asynchronous chunk.
    // In development, it does not produce real files.
    filename: WPCONST.OUTPUT_SCRIPT_FILENAME,
    chunkFilename: WPCONST.OUTPUT_SCRIPT_CHUNK_FILENAME,
    sourceMapFilename: WPCONST.OUTPUT_SCRIPT_SOURCEMAP_FILENAME,
    // this defaults to 'window', but by setting it to 'this' then
    // module chunks which are built will work in web workers as well.
    // globalObject: 'this',
  },
  node: {
    module: 'empty',
    dgram: 'empty',
    dns: 'mock',
    fs: 'empty',
    http2: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  },
};

showEnvInfo();

if (WPCONST.IS_SMP) {
  const smp = new SpeedMeasurePlugin();
  webpackConfig = smp.wrap(webpackConfig);
}

module.exports = webpackConfig;
