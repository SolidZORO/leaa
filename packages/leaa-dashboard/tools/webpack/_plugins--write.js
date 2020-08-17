/* eslint-disable max-len */
const WriteFilePlugin = require('write-file-webpack-plugin');

module.exports = {
  writePlugins: [
    new WriteFilePlugin(),
    // new WriteFilePlugin({
    //   test: /(index\.html$|\/assets\/|\/libs\/|_env.*)/,
    //   useHashIndex: true,
    // }),
  ].filter(Boolean),
};
