const webpackConst = require('./_webpack_const');

// provide
const provide = {
  // $: 'jquery',
};

// alias
const resolve = {
  extensions: ['.tsx', '.ts', '.jsx', '.js', '.css', '.less'],
  alias: {
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
