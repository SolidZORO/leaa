const { WPCONST } = require('./_const');

module.exports = {
  scriptModule: {
    test: WPCONST.REGX_SCRIPT,
    include: WPCONST.SRC_DIR,
    rules: [{ loader: 'babel-loader?cacheDirectory' }],
  },
};
