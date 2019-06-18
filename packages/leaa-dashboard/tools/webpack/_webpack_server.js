const webpackConst = require('./_webpack_const');
const webpackStats = require('./_webpack_stats');

const webpackServerConfig = {
  contentBase: webpackConst.BUILD_PUBLIC_DIR,
  https: Boolean(process.env.PROTOCOL.toString() === 'https'),
  port: process.env.PORT,
  hot: true,
  // inline: true,
  // Specify what bundle information gets displayed
  // https://webpack.js.org/configuration/stats/
  stats: webpackStats,
  compress: true,
  // open: false,
  allowedHosts: [
    // 'host.com',
    // 'host2.com'
  ],
  quiet: true,
  noInfo: false,
  openPage: '',
  // watchContentBase: true,
  // historyApiFallback: true,
  historyApiFallback: {
    // disableDotRule: false,
    // index: '/index.html',
  },
  clientLogLevel: 'error',
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
};

module.exports = webpackServerConfig;
