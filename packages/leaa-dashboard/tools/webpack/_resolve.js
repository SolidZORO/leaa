// const { WPCONST } = require('./_const');

module.exports = {
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.css', '.less', '.po'],
    alias: {
      moment$: 'moment/moment.js',
      // '@': '../src',
      // lodash: 'lodash-es',
      // 'antd/es/style/core/base.less': `${WPCONST.SRC_DIR}/styles/reset.less`,
    },
  },
};
