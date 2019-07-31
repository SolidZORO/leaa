const webpackStats = require('./_webpack_stats');
const webpackConst = require('./_webpack_const');
const webpackModule = require('./_webpack_module');
const webpackPlugin = require('./_webpack_plugin');
const webpackShimming = require('./_webpack_shimming');
const webpackServerConfig = require('./_webpack_server');
const webpackOptimization = require('./_webpack_optimization');

// console.log(webpackConst);
// console.log('\n\n');

const webpackConfig = {
  entry: { index: './src/index.tsx' },
  mode: webpackConst.MODE,
  context: webpackConst.ROOT_DIR,
  cache: webpackConst.__DEV__,
  bail: true,
  watch: webpackConst.IS_SERVER,
  devServer: webpackServerConfig,
  stats: webpackStats,
  resolve: webpackShimming.resolve,
  module: webpackModule,
  plugins: webpackPlugin,
  externals: webpackShimming.externals,
  output: {
    pathinfo: true,
    path: webpackConst.BUILD_STATICS_DIR,
    publicPath: webpackConst.CDN_STATICS_DIR_URL,
    filename: webpackConst.OUTPUT_SCRIPT_FILENAME,
    chunkFilename: webpackConst.OUTPUT_SCRIPT_CHUNK_FILENAME,
    sourceMapFilename: webpackConst.OUTPUT_SCRIPT_SOURCEMAP_FILENAME,
  },
  // https://webpack.docschina.org/configuration/devtool/
  devtool: webpackConst.DEVTOOL,
  optimization: webpackOptimization,
  node: {
    fs: 'empty',
    path: 'empty',
  },
};

module.exports = webpackConfig;
