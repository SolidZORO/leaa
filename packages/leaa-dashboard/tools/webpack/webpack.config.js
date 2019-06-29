// REQUIRE
const HtmlWebpackPlugin = require('html-webpack-plugin');

const webpackConst = require('./_webpack_const');
const webpackAnalyzerConfig = require('./_webpack_analyzer');
const webpackServerConfig = require('./_webpack_server');
const webpackModule = require('./_webpack_module');
const webpackPlugin = require('./_webpack_plugin');
const webpackShimming = require('./_webpack_shimming');
const webpackStats = require('./_webpack_stats');
const webpackOptimization = require('./_webpack_optimization');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

// console.log(webpackConst);
// console.log('\n\n');

// output HTML
const outputHtmlOption = {
  title: `${process.env.NAME}${
    (webpackConst.IS_SERVER || webpackConst.__DEV__)
      ? ' - DEV'
      : ''
    }`,
  filename: `${webpackConst.BUILD_PUBLIC_DIR}/index.html`,
  template: `${webpackConst.VIEWS_DIR}/index.ejs`,
  // inject: 'body',
  inject: true,
  hash: true,
  minify: {
    removeComments: true,
    collapseWhitespace: false,
  },
};

webpackPlugin.push(new HtmlWebpackPlugin(outputHtmlOption));


if (webpackConst.IS_ANALYZER) {
  webpackPlugin.push(
    new BundleAnalyzerPlugin(webpackAnalyzerConfig),
  );
}


const webpackConfig = {
  entry: {
    index: ['@babel/polyfill', './src/index.tsx'],
    // index: './src/index.tsx',
    // index: './src/__webpack_test__/webpack_test.tsx',
  },
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
    net: 'empty',
    tls: 'empty',
  },
};

module.exports = webpackConfig;

