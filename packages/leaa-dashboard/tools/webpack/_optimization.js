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

optimization.splitChunks = {
  chunks: 'async',
  minSize: 30000,
  // minChunks: 2,
  // maxAsyncRequests: 5,
  // maxInitialRequests: 3,
  // automaticNameDelimiter: '~',
  automaticNameMaxLength: 30,
  name: true,
  cacheGroups: {
    REACT: {
      name: '_react',
      test: /[\\/](react|react-dom|react-router)/,
      chunks: 'initial',
      priority: 95,
      reuseExistingChunk: true,
      enforce: true,
    },
    ANTD: {
      name: '_antd',
      test: /[\\/](antd)/,
      chunks: 'initial',
      priority: 90,
      reuseExistingChunk: true,
      enforce: true,
    },
    ANTD_EXT: {
      name: '_antd-ext',
      test: /[\\/](@ant-design|rc-*|tinycolor2)/,
      chunks: 'initial',
      priority: 80,
      reuseExistingChunk: true,
      enforce: true,
    },
    LIBS: {
      name: '_libs',
      test: /[\\/]node_modules[\\/](mobx|axios|i18next)/,
      chunks: 'initial',
      priority: 40,
      reuseExistingChunk: true,
      enforce: true,
    },
    APOLLO: {
      name: '_apollo',
      test: /[\\/]node_modules[\\/](apollo*|\\@apollo*|graphqls*)/,
      chunks: 'initial',
      priority: 30,
      reuseExistingChunk: true,
      enforce: true,
    },
    REACT_SORTABLE_TREE: {
      name: '_react-sortable-tree',
      test: /[\\/]node_modules[\\/]react-sortable-tree/,
      chunks: 'initial',
      priority: 20,
      reuseExistingChunk: true,
      enforce: true,
    },
    VENDORS: {
      name: '_vendors',
      test: /[\\/]node_modules[\\/]/,
      chunks: 'initial',
      priority: 10,
      reuseExistingChunk: true,
      enforce: true,
    },
    // G: {
    //   chunks: 'async',
    //   minChunks: 2,
    //   minSize: 100000,
    //   priority: 1,
    //   reuseExistingChunk: true,
    //   enforce: true,
  },
};

if (WPCONST.__DEV__) {
  //
  // DEV PLUGIN
  //
} else {
  // optimization.minimizer = [];
  //
  // PROD PLUGIN
  //
  optimization.minimize = true;
  optimization.minimizer = [
    new TerserPlugin({
      parallel: true,
      cache: true,
      // exclude: /\/(monaco|codemirror)/,
      extractComments: false,
      sourceMap: false,
      terserOptions: {
        ecma: 8,
        warnings: false,
        parse: {},
        compress: {
          unused: true,
          warnings: false,
          drop_debugger: true,
          dead_code: true,
        },
        mangle: true, // Note `mangle.properties` is `false` by default.
        module: false,
        output: {
          comments: false,
        },
        toplevel: false,
        nameCache: null,
        ie8: false,
        keep_classnames: undefined,
        keep_fnames: false,
        safari10: false,
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

  // optimization.minimize = false;
  // optimization.minimizer = [];
}

module.exports = { optimization };
