const webpackConst = require('./_webpack_const');

// provide
const provide = {
  $: 'jquery',
  jQuery: 'jquery',
};

// alias
const resolve = {
  extensions: ['.tsx', '.ts', '.jsx', '.js', '.css', '.less'],
  alias: {
    // '@leaa/common': '../_leaa-common/src',
    // '@leaa/dashboard': './src',
    // '@styles': `${webpackConst.SRC_DIR}/styles`,
    // '@assets': `${webpackConst.SRC_DIR}/assets`,
    // '@': webpackConst.SRC_DIR,
    // '@ant-design/icons/lib/dist$': `${webpackConst.SRC_DIR}/assets/fonts/font_antd/@ant-design/icons/lib/dist`,
  },
};

// externals (src mode)
const externals = {
  // 'prop-types': 'PropTypes',
};

module.exports = {
  provide,
  resolve,
  externals,
};
