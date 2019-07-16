const fs = require('fs');
const path = require('path');

const lessToJS = require('less-vars-to-js');
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');

const withLessExcludeAntd = require('./configs/next-less.config');
const withImage = require('./configs/next-image.config');
const withDotenv = require('./configs/next-dotenv.config');

// Where your antd-custom.less file lives
const antdVariables = lessToJS(fs.readFileSync(path.resolve(__dirname, './styles/variables.less'), 'utf8'));

// fix: prevents error when .less files are required by node
if (typeof require !== 'undefined') {
  require.extensions['.less'] = file => {};
}

const HACK_REMOVE_MINIMIZE_OPTION_FROM_CSS_LOADERS = config => {
  console.warn('HACK: Removing `minimize` option from `css-loader` entries in Webpack config');

  config.module.rules.forEach(rule => {
    if (Array.isArray(rule.use)) {
      rule.use.forEach(u => {
        if (u.loader === 'css-loader' && u.options) {
          delete u.options.minimize;
        }
      });
    }
  });
};

module.exports = withDotenv(
  withImage(
    withLessExcludeAntd({
      cssModules: true,
      cssLoaderOptions: {
        sourceMap: false,
        importLoaders: 1,
      },
      lessLoaderOptions: {
        javascriptEnabled: true,
        modifyVars: antdVariables,
      },
      webpack: function(config) {
        config.plugins.push(
          new FilterWarningsPlugin({
            // ignore ANTD chunk styles [mini-css-extract-plugin] warning
            exclude: /mini-css-extract-plugin[^]*Conflicting order between:/,
          }),
        );

        HACK_REMOVE_MINIMIZE_OPTION_FROM_CSS_LOADERS(config);

        return config;
      },
    }),
  ),
);
