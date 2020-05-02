const fs = require('fs');
const lessToJS = require('less-vars-to-js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const { WPCONST } = require('./_const');

const antdModifyVars = lessToJS(fs.readFileSync(`${WPCONST.SRC_DIR}/styles/variables.less`, 'utf8'));

const modules = {
  strictExportPresence: false,
};

modules.rules = [
  {
    test: WPCONST.REGX_TS,
    include: WPCONST.SRC_DIR,
    exclude: /node_modules/,
    rules: [{ loader: 'babel-loader?cacheDirectory' }],
  },
  {
    test: WPCONST.REGX_SCRIPT_MAP,
    rules: [{ loader: 'file-loader' }],
  },
  //
  // for MODULE STYLE
  {
    test: WPCONST.REGX_MODULE_STYLE,
    rules: [
      { loader: WPCONST.__DEV__ ? 'style-loader' : MiniCssExtractPlugin.loader },
      {
        loader: 'css-loader',
        options: {
          importLoaders: 2,
          sourceMap: false,
          modules: {
            localIdentName: WPCONST.LOADER_CSS_LOADERR_LOCAL_IDENT_NAME,
          },
        },
      },
      { loader: 'postcss-loader' },
      {
        loader: 'less-loader',
        options: {
          lessOptions: {
            javascriptEnabled: true,
            modifyVars: antdModifyVars,
          },
        },
      },
    ],
  },
  //
  // for STYLE
  {
    test: WPCONST.REGX_STYLE,
    exclude: [WPCONST.REGX_MODULE_STYLE],
    use: [
      { loader: WPCONST.__DEV__ ? 'style-loader' : MiniCssExtractPlugin.loader },
      {
        loader: 'css-loader',
        options: {
          importLoaders: 2,
          sourceMap: false,
        },
      },
      { loader: 'postcss-loader' },
      {
        loader: 'less-loader',
        options: {
          lessOptions: {
            javascriptEnabled: true,
            modifyVars: antdModifyVars,
          },
        },
      },
    ],
  },
  //
  // IMAGE
  {
    test: WPCONST.REGX_IMAGE,
    exclude: [/src[\\/]assets[\\/]fonts/],
    use: [
      {
        loader: 'url-loader',
        options: {
          limit: 8192,
          name: `images/${WPCONST.STATIC_ASSET_NAME}`,
        },
      },
    ],
  },
  //
  // FONT
  {
    test: WPCONST.REGX_FONT,
    // include: /src[\\/]assets[\\/]fonts/,
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

module.exports = { modules };
