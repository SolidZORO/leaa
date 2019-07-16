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

module.exports = withDotenv(
  withImage(
    withLessExcludeAntd({
      cssModules: true,
      cssLoaderOptions: {
        importLoaders: 1,
        localIdentName: '[local]___[hash:6]',
      },
      lessLoaderOptions: {
        javascriptEnabled: true,
        modifyVars: antdVariables,
      },
      // useFileSystemPublicRoutes: false,
      webpack: function(config, { buildId, dev }) {
        const originalEntry = config.entry;

        // config.resolve = {
        //   ...config.resolve,
        //   ...{
        //     alias: {
        //       ...config.resolve.alias,
        //       '@src': path.resolve(__dirname, 'src'),
        //       '@components': path.resolve(__dirname, 'components'),
        //       '@interfaces': path.resolve(__dirname, 'interfaces'),
        //       '@stores': path.resolve(__dirname, 'stores'),
        //       '@pages': path.resolve(__dirname, 'client'),
        //       '@styles': path.resolve(__dirname, 'styles'),
        //       '@graphqls': path.resolve(__dirname, 'graphqls'),
        //     },
        //   },
        // };

        config.plugins.push(
          new FilterWarningsPlugin({
            // ignore ANTD chunk styles [mini-css-extract-plugin] warning
            exclude: /mini-css-extract-plugin[^]*Conflicting order between:/,
          }),
        );

        return config;
      },
    }),
  ),
);
