// REQUIRE
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const Dotenv = require('dotenv-webpack');
// const opn = require('opn');
// const SizePlugin = require('size-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
// const CopyWebpackPlugin = require('copy-webpack-plugin');

const webpackConst = require('./_webpack_const');
const webpackShimming = require('./_webpack_shimming');

class WebpackCallbackPlugin {
  apply(compiler) {
    compiler.hooks.done.tap('WebpackCallbackPlugin', () => {
      if (webpackConst.IS_SERVER) {
        // emoji for CLI
        const serverBaseByText = `${process.env.PROTOCOL}://${process.env.BASE_HOST}:${process.env.PORT}`;
        const serverBaseByEmoji = `✨✨ \x1b[00;45;9m${serverBaseByText}\x1b[0m ✨✨`;

        console.log(`\n\n> ${process.env.NODE_ENV} URL ${serverBaseByEmoji}\n`);
      }
    });
  }
}


// PLUGIN
const pluginList = [];

pluginList.push(
  new WriteFilePlugin({
    test: /(favicon\.ico$|index\.html$|env\.js$|\/assets\/)/,
    useHashIndex: true,
  }),
  // new SizePlugin(),
  new webpack.ProvidePlugin(webpackShimming.provide),
  new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn|zh-hk|en/),
);


if (webpackConst.__DEV__) {
  //
  // DEV PLUGIN
  //
  pluginList.push(
    new webpack.NamedChunksPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
    new Dotenv({
      path: './.env.development',
    }),
    new WebpackCallbackPlugin(),
  );
} else {
  //
  // PROD PLUGIN
  //
  pluginList.push(
    new webpack.HashedModuleIdsPlugin(),
    new MiniCssExtractPlugin({
      filename: webpackConst.OUTPUT_STYLE_FILENAME,
      chunkFilename: webpackConst.OUTPUT_STYLE_CHUNK_FILENAME,
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    new Dotenv({
      path: './.env',
    }),
  );
}

module.exports = pluginList;
