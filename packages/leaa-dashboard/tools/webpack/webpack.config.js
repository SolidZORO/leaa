const { WPCONST } = require('./_const');
const { modules } = require('./_modules');
const { plugins } = require('./_plugins');
//
const { stats } = require('./_stats');
const { resolve } = require('./_resolve');
const { externals } = require('./_externals');
const { devServer } = require('./_devServer');
const { optimization } = require('./_optimization');

// @see https://webpack.docschina.org/configuration/devtool/
const webpackConfig = {
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
    pathinfo: WPCONST.__DEV__,
    path: WPCONST.OUTPUT_PATH,
    publicPath: WPCONST.OUTPUT_PUBLIC_PATH,
    //
    // # for PROJECT
    filename: WPCONST.OUTPUT_SCRIPT_FILENAME,
    chunkFilename: WPCONST.OUTPUT_SCRIPT_CHUNK_FILENAME,
    sourceMapFilename: WPCONST.OUTPUT_SCRIPT_SOURCEMAP_FILENAME,
    //
    // # for LIBS
    // filename: 'x.js',
    // library: 'X',
    // libraryTarget: 'umd',
    // libraryExport: 'default',
    // umdNamedDefine: true,
    // chunkFilename: WPCONST.OUTPUT_SCRIPT_CHUNK_FILENAME,
    // sourceMapFilename: WPCONST.OUTPUT_SCRIPT_SOURCEMAP_FILENAME,
  },
  node: {
    fs: 'empty',
    path: 'empty',
  },
};

module.exports = webpackConfig;
