const TerserPlugin = require('terser-webpack-plugin');
const webpackConst = require('./_webpack_const');

const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const optimizationList = {
  namedModules: true,
  runtimeChunk: true,
  noEmitOnErrors: true,
  // concatenateModules: true,
  sideEffects: false,
};

optimizationList.splitChunks = {
  chunks: 'all',
  // chunks: 'async',
  // minSize: 30000,
  // minChunks: 2,
  // maxAsyncRequests: 5,
  // maxInitialRequests: 3,
  // automaticNameDelimiter: '~',
  name: true,
  cacheGroups: {
    __LIBS: {
      name: '__libs',
      test: /[\\/]node_modules[\\/](react|react-dom|mobx|mox-react)[\\/]/,
      chunks: 'all',
      priority: 99,
      reuseExistingChunk: true,
      enforce: true,
    },
    __EDITOREXT: {
      name: '__editorext',
      test: /[\\/](highlight\.js|codemirror|markdown-it)[\\/]/,
      chunks: 'initial',
      priority: 97,
      reuseExistingChunk: true,
      enforce: true,
    },
    __JQUERY: {
      name: '__jquery',
      test: /[\\/](jquery)[\\/]/,
      chunks: 'initial',
      priority: 97,
      reuseExistingChunk: true,
      enforce: true,
    },
    __MOMENT: {
      name: '__moment',
      test: /[\\/](moment)[\\/]/,
      chunks: 'initial',
      priority: 97,
      reuseExistingChunk: true,
      enforce: true,
    },
    __TUI: {
      name: '__tui',
      test: /[\\/](tui-editor|@toast-ui)[\\/]/,
      chunks: 'initial',
      priority: 97,
      reuseExistingChunk: true,
      enforce: true,
    },
    __MONACO: {
      name: '__monaco',
      test: /[\\/](monaco|monaco-editor)[\\/]/,
      chunks: 'initial',
      priority: 96,
      reuseExistingChunk: true,
      enforce: true,
    },
    __ANTDFONT: {
      name: '__antdfont',
      test: /[\\/]@ant-design[\\/]/,
      chunks: 'initial',
      priority: 95,
      reuseExistingChunk: true,
      enforce: true,
    },
    __ANTD: {
      name: '__antd',
      test: /[\\/]antd[\\/]/,
      chunks: 'initial',
      priority: 90,
      reuseExistingChunk: true,
      enforce: true,
    },
    __VENDORS: {
      name: '__vendors',
      test: /[\\/]node_modules[\\/]/,
      chunks: 'initial',
      priority: 9,
      reuseExistingChunk: true,
      enforce: true,
    },
    __G: {
      chunks: 'async',
      minChunks: 2,
      minSize: 100000,
      priority: 1,
      reuseExistingChunk: true,
      enforce: true,
    },
  },
};

if (webpackConst.__DEV__) {
  //
  // DEV PLUGIN
  //
} else {
  // optimizationList.minimizer = [];
  //
  // PROD PLUGIN
  //
  optimizationList.minimizer = [
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
        autoprefixer: false,
      },
      canPrint: true,
    }),
  ];
}

module.exports = optimizationList;
