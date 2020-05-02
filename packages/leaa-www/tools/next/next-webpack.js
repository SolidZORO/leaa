/* eslint-disable */
const path = require('path');
const webpack = require('webpack');
const fs = require('fs');
const lessToJS = require('less-vars-to-js');
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');

const cssLoaderConfig = require('../plugin/css-loader-config');

const antdModifyVars = lessToJS(fs.readFileSync(path.resolve(__dirname, '../../src/styles/variables.less'), 'utf8'));
const ANTD_STYLE_REGX = /antd\/.*?\/style.*?/;

module.exports = (config, options) => {
  if (!options.defaultLoaders) {
    throw new Error(
      'This plugin is not compatible with Next.js versions below 5.0.0 https://err.sh/next-plugins/upgrade',
    );
  }

  const { dev, isServer } = options;

  // comstom antd icon
  config.resolve.alias = {
    ...config.resolve.alias,
    swiper$: 'swiper/js/swiper.js',
    moment$: 'moment/moment.js',
  };

  config.node = { fs: 'empty' };

  //
  // PLUGINS
  config.plugins.push(
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn|en/),
    // new webpack.NormalModuleReplacementPlugin(
    //   // ⚠️ fixed wechat HMR (replace mod eventsource.js)
    //   /\/eventsource$/,
    //   path.resolve(__dirname, './next-eventsource.js'),
    // ),
    new FilterWarningsPlugin({
      // ignore ANTD chunk styles [mini-css-extract-plugin] warning
      exclude: /Conflicting order/,
    }),
  );

  //
  // MODULE
  const baseLessConfig = {
    dev,
    isServer,
    loaders: [
      {
        loader: 'less-loader',
        options: {
          lessOptions: {
            javascriptEnabled: true,
            modifyVars: antdModifyVars,
          },
        },
      },
    ],
    extensions: ['less'],
    cssLoaderOptions: {
      sourceMap: false,
      importLoaders: 2,
    },
  };

  config.module.rules.push({
    test: /\.less$/,
    exclude: /\.module\.less$/,
    // use: cssLoaderConfig(config, baseLessConfig),
    use: cssLoaderConfig(config, {
      ...baseLessConfig,
      cssModules: false,
      cssLoaderOptions: {
        sourceMap: false,
        importLoaders: 2,
      },
    }),
  });

  config.module.rules.push({
    test: /\.module\.less$/,
    use: cssLoaderConfig(config, {
      ...baseLessConfig,
      cssModules: true,
      cssLoaderOptions: {
        sourceMap: false,
        importLoaders: 2,
        modules: {
          localIdentName: dev ? '[local]--[hash:4]' : '[local]--[hash:4]',
        },
      },
    }),
  });

  config.module.rules.push({
    test: /\.(jpg|jpeg|png|svg|ttf|woff|woff2|eot|otf)$/,
    use: {
      loader: 'url-loader',
      options: {
        limit: 1024, // base64
        publicPath: '/_next/static/',
        outputPath: 'static/',
        name: '[name].[ext]',
      },
    },
  });

  //
  // SERVER
  if (isServer) {
    const rawExternals = [...config.externals];

    config.externals = [
      // eslint-disable-next-line consistent-return
      (context, request, callback) => {
        if (request.match(ANTD_STYLE_REGX)) {
          return callback();
        }

        if (typeof rawExternals[0] === 'function') {
          rawExternals[0](context, request, callback);
        } else {
          callback();
        }
      },
      ...(typeof rawExternals[0] === 'function' ? [] : rawExternals),
    ];

    config.module.rules.unshift({
      test: ANTD_STYLE_REGX,
      use: 'null-loader',
    });
  }

  if (typeof config === 'function') {
    return config;
  }

  return config;
};
