/* eslint-disable max-len */
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

module.exports = {
  lodashPlugins: [
    new LodashModuleReplacementPlugin({
      shorthands: true, // for _.groupBy
      // cloning: true,
      // currying: true,
      // caching: true,
      collections: true,
      // exotics: true,
      // guards: true,
      // metadata: true,
      // deburring: true,
      // unicode: true,
      // chaining: true,
      // memoizing: true,
      // coercions: true,
      // flattening: true,
      // paths: true,
      // placeholders: true,
    }),
  ].filter(Boolean),
};
