const fs = require('fs');
const lessToJS = require('less-vars-to-js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const webpackConst = require('./_webpack_const');

const antdModifyVars = lessToJS(fs.readFileSync(`${webpackConst.SRC_DIR}/styles/variables.less`, 'utf8'));

// REQUIRE
const webpackModule = {
  strictExportPresence: false,
};

webpackModule.rules = [
  {
    test: webpackConst.REGX_TS,
    include: webpackConst.SRC_DIR,
    exclude: /node_modules/,
    rules: [
      {
        loader: 'babel-loader?cacheDirectory',
      },
    ],
  },
  //
  // FOR MODULE STYLE
  {
    test: webpackConst.REGX_MODULE_STYLE,
    rules: [
      {
        loader: webpackConst.__DEV__ ? 'style-loader' : MiniCssExtractPlugin.loader,
      },
      {
        loader: 'css-loader',
        options: {
          modules: {
            localIdentName: webpackConst.LOADER_CSS_LOADERR_LOCAL_IDENT_NAME,
          },
          importLoaders: 2,
          sourceMap: false,
        },
      },
      {
        loader: 'postcss-loader',
      },
      {
        loader: 'less-loader',
        options: {
          javascriptEnabled: true,
        },
      },
    ],
  },
  //
  // FOR STYLE
  {
    test: webpackConst.REGX_STYLE,
    exclude: webpackConst.REGX_MODULE_STYLE,
    use: [
      {
        loader: webpackConst.__DEV__ ? 'style-loader' : MiniCssExtractPlugin.loader,
      },
      {
        loader: 'css-loader',
        options: {
          importLoaders: 2,
          sourceMap: false,
        },
      },
      {
        loader: 'postcss-loader',
      },
      {
        loader: 'less-loader',
        options: {
          javascriptEnabled: true,
          modifyVars: antdModifyVars,
        },
      },
    ],
  },
  //
  // IMAGE
  {
    test: webpackConst.REGX_IMAGE,
    exclude: /src[\\/]assets[\\/]fonts/,
    use: [
      {
        loader: 'url-loader',
        options: {
          // limit: 8192,
          limit: 1024,
          name: `images/${webpackConst.STATIC_ASSET_NAME}`,
        },
      },
    ],
  },
  //
  // FONT
  {
    test: webpackConst.REGX_FONT,
    include: /src[\\/]assets[\\/]fonts/,
    use: [
      {
        loader: 'url-loader',
        options: {
          limit: 8192,
          name: 'fonts/[folder]/[name].[ext]?[hash:8]',
        },
      },
    ],
  },
];

module.exports = webpackModule;
