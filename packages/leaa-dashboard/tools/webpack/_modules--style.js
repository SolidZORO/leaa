const fs = require('fs');
const lessToJS = require('less-vars-to-js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const { WPCONST } = require('./_const');

const lessVarsPath = `${WPCONST.SRC_DIR}/styles/variables.less`;
let lessModifyVars = fs.existsSync(lessVarsPath) ? lessToJS(fs.readFileSync(lessVarsPath, 'utf8')) : '';

module.exports = {
  styleModule: {
    test: WPCONST.REGX_STYLE,
    use: [
      { loader: WPCONST.__DEV__ ? 'style-loader' : MiniCssExtractPlugin.loader },
      {
        loader: 'css-loader',
        options: {
          importLoaders: 2,
          sourceMap: false,
          modules: {
            auto: true,
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
            modifyVars: lessModifyVars,
          },
        },
      },
    ],
  },
};
