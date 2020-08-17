/* eslint-disable max-len */
// const { WPCONST } = require('./_const');

module.exports = {
  resolve: {
    // 1st find .js, and then find other
    extensions: ['.js', '.ts', '.tsx', '.jsx'],
    alias: {
      '@': '../src',
      // 'antd/es/style/core/base.less': `${WPCONST.SRC_DIR}/styles/reset.less`,
    },
  },
};
