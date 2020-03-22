const { WPCONST } = require('./_const');
const { stats } = require('./_stats');

module.exports = {
  devServer: {
    contentBase: WPCONST.BUILD_PUBLIC_DIR,
    https: Boolean(`${process.env.SERVER_PROTOCOL}` === 'https'),
    port: process.env.SERVER_PORT,
    hot: true,
    // inline: true,
    // Specify what bundle information gets displayed
    // https://webpack.js.org/configuration/stats/
    stats,
    compress: false,
    // open: false,
    // quiet: true,
    quiet: false,
    noInfo: false,
    openPage: '',
    // watchContentBase: true,
    // historyApiFallback: true,
    historyApiFallback: {
      // disableDotRule: false,
      // index: '/index.html',
    },
    clientLogLevel: 'error',
    // clientLogLevel: 'debug',
    // disableHostCheck: true,
    watchOptions: {
      // aggregateTimeout: 300,
      // poll: 10,
      // poll: false,
      ignored: /node_modules/,
    },
    // overlay: false,
    overlay: {
      warnings: true,
      errors: true,
    },
    disableHostCheck: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    },
  },
};
