const fs = require('fs');
const path = require('path');

const lessToJS = require('less-vars-to-js');
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');

const withImage = require('./configs/next-image.config');
const withDotenv = require('./configs/next-dotenv.config');
const withAntd = require('./configs/next-antd.config');

const antdVariables = lessToJS(fs.readFileSync(path.resolve(__dirname, './styles/variables.less'), 'utf8'));

// fix: prevents error when .less files are required by node
if (typeof require !== 'undefined') {
  require.extensions['.less'] = file => {};
}

module.exports = withDotenv(
  withImage(
    withAntd({
      cssModules: true,
      cssLoaderOptions: {
        sourceMap: false,
        importLoaders: 1,
      },
      lessLoaderOptions: {
        javascriptEnabled: true,
        modifyVars: antdVariables,
      },
      webpack: config => {
        config.plugins.push(
          new FilterWarningsPlugin({
            // ignore ANTD chunk styles [mini-css-extract-plugin] warning
            exclude: /mini-css-extract-plugin[^]*Conflicting order between:/,
          }),
        );

        // comstom antd icon
        config.resolve.alias['@ant-design/icons/lib/dist$'] = path.resolve(__dirname, './libs/antd-icon.lib');

        return config;
      },
    }),
  ),
);
