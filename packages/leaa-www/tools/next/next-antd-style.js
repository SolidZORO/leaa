/* eslint-disable */
const fs = require('fs');
const path = require('path');
const lessToJS = require('less-vars-to-js');
const cssLoaderConfig = require('@zeit/next-css/css-loader-config');

const antdVariables = lessToJS(fs.readFileSync(path.resolve(__dirname, '../../src/styles/variables.less'), 'utf8'));

module.exports = (nextConfig = {}) => ({
  ...nextConfig,
  ...{
    webpack(config, options) {
      if (!options.defaultLoaders) {
        throw new Error(
          'This plugin is not compatible with Next.js versions below 5.0.0 https://err.sh/next-plugins/upgrade',
        );
      }

      const { dev, isServer } = options;

      // for all less in client
      const baseLessConfig = {
        dev,
        isServer,
        loaders: [
          {
            loader: 'less-loader',
            options: {
              javascriptEnabled: true,
              modifyVars: antdVariables,
            },
          },
        ],
        cssLoaderOptions: {
          sourceMap: false,
          importLoaders: 2,
        },
      };

      // FOR node_modules (e.g. antd, swiper...)
      config.module.rules.push({
        test: /\.less$/,
        include: /node_modules/,
        use: cssLoaderConfig(config, baseLessConfig),
      });

      // FOR src
      config.module.rules.push({
        test: /\.less$/,
        exclude: /node_modules/,
        use: cssLoaderConfig(config, {
          ...baseLessConfig,
          extensions: ['less'],
          cssModules: true,
          cssLoaderOptions: {
            ...baseLessConfig.cssLoaderOptions,
            localIdentName: '[local]--[hash:8]',
          },
        }),
      });

      // for antd less in server (yarn build)
      if (isServer) {
        const antdStyles = /antd\/.*?\/style.*?/;
        const rawExternals = [...config.externals];

        config.externals = [
          (context, request, callback) => {
            if (request.match(antdStyles)) {
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
          test: antdStyles,
          use: 'null-loader',
        });
      }

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options);
      }

      return config;
    },
  },
});
