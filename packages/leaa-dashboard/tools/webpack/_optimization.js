const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const { WPCONST } = require('./_const');

const optimization = {
  namedModules: true,
  runtimeChunk: false,
  noEmitOnErrors: true,
  // concatenateModules: true,
  //
  // usedExports: true,
  // usedExports: false,
  // sideEffects: true,
  // sideEffects: false,
};

// optimization.splitChunks = {
//   // chunks: 'all',
//   chunks: 'async',
//   minSize: 30000,
//   // minChunks: 2,
//   // maxAsyncRequests: 5,
//   // maxInitialRequests: 3,
//   // automaticNameDelimiter: '~',
//   name: true,
//   cacheGroups: {
//     // __RC: {
//     //   name: '__rc',
//     //   test: /[\\/]node_modules[\\/](rc-*)/,
//     //   chunks: 'all',
//     //   priority: 99,
//     //   reuseExistingChunk: true,
//     //   enforce: true,
//     // },
//     __REACT: {
//       name: '__react',
//       test: /[\\/](react|react-dom)[\\/]/,
//       chunks: 'initial',
//       priority: 93,
//       reuseExistingChunk: true,
//       enforce: true,
//     },
//     __MOMENT: {
//       name: '__moment',
//       test: /[\\/](moment)/,
//       chunks: 'initial',
//       priority: 97,
//       reuseExistingChunk: true,
//       enforce: true,
//     },
//     __MONACO: {
//       name: '__monaco',
//       test: /[\\/](monaco|monaco-*)/,
//       chunks: 'initial',
//       priority: 96,
//       reuseExistingChunk: true,
//       enforce: true,
//     },
//     __ANTD: {
//       name: '__antd',
//       test: /[\\/](antd|@ant-design)[\\/]/,
//       chunks: 'initial',
//       priority: 90,
//       reuseExistingChunk: true,
//       enforce: true,
//     },
//     // __VENDORS: {
//     //   name: '__vendors',
//     //   test: /[\\/]node_modules[\\/]/,
//     //   chunks: 'initial',
//     //   priority: 9,
//     //   reuseExistingChunk: true,
//     //   enforce: true,
//     // },
//     // __G: {
//     //   chunks: 'async',
//     //   minChunks: 2,
//     //   minSize: 100000,
//     //   priority: 1,
//     //   reuseExistingChunk: true,
//     //   enforce: true,
//     // },
//   },
// };

if (WPCONST.__DEV__) {
  //
  // DEV PLUGIN
  //
} else {
  // optimization.minimizer = [];
  //
  // PROD PLUGIN
  //
  optimization.minimizer = [
    new TerserPlugin({
      parallel: true,
      cache: true,
      exclude: /\/monaco/,
      extractComments: false,
      terserOptions: {
        ecma: 8,
        warnings: false,
        compress: {
          unused: true,
          warnings: false,
          drop_debugger: true,
        },
        output: {
          comments: false,
        },
        // toplevel: false,
        // nameCache: null,
        ie8: false,
        safari10: true,
        // keep_classnames: undefined,
        // keep_fnames: false,
        mangle: {
          safari10: true,
        },
      },
    }),
    new OptimizeCSSAssetsPlugin({
      assetNameRegExp: /\.css\.*(?!.*map)/g,
      cssProcessorOptions: {
        reduceIdents: false, // https://github.com/ben-eb/cssnano/issues/247
        mergeLonghand: false,
        discardComments: { removeAll: true },
        safe: true,
        autoprefixer: { disable: true },
      },
      canPrint: true,
    }),
  ];
}

module.exports = { optimization };
