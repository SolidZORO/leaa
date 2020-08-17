const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const { WPCONST } = require('./_const');
const { showEnvInfo } = require('./__fn');

const { analyzer } = require('./_analyzer');
const { provide } = require('./_provide');

const { htmlPlugins } = require('./_plugins--html');
const { lodashPlugins } = require('./_plugins--lodash');
const { writePlugins } = require('./_plugins--write');
const { copyPlugins } = require('./_plugins--copy');

class ShowEnvInfoWebpackPlugin {
  apply(compiler) {
    compiler.hooks.done.tap('ShowEnvInfoWebpackPlugin', () => showEnvInfo(WPCONST));
  }
}

const basePlugins = [
  new ShowEnvInfoWebpackPlugin(),
  new ForkTsCheckerWebpackPlugin(),
  new webpack.ProvidePlugin(provide),
  new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn/),
  new webpack.DefinePlugin({
    __DEV__: WPCONST.__DEV__,
    __WEBPACK_PUBLIC_PATH__: JSON.stringify(WPCONST.OUTPUT_PUBLIC_PATH),
  }),

  //
  //
  //
  // DEV ONLY
  WPCONST.__DEV__ && new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify('development') }),
  WPCONST.__DEV__ && new webpack.NamedChunksPlugin(),
  WPCONST.__DEV__ && new webpack.WatchIgnorePlugin(['node_modules', 'node_modules/**']),

  //
  //
  //
  // PROD ONLY
  WPCONST.__PROD__ && new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify('production') }),
  WPCONST.__PROD__ && new webpack.HashedModuleIdsPlugin(),
  WPCONST.__PROD__ &&
    new MiniCssExtractPlugin({
      filename: WPCONST.OUTPUT_STYLE_FILENAME,
      chunkFilename: WPCONST.OUTPUT_STYLE_CHUNK_FILENAME,
    }),

  //
  //
  //
  // ANALYZER ONLY
  WPCONST.IS_ANALYZER && new BundleAnalyzerPlugin(analyzer),
].filter(Boolean);

module.exports = {
  // prettier-ignore
  plugins: [
    ...basePlugins,
    ...htmlPlugins,
    ...lodashPlugins,
    ...copyPlugins,
    ...writePlugins,
  ]
};
