/* eslint-disable */
const fs = require('fs');
const path = require('path');
const lessToJS = require('less-vars-to-js');
const cssLoaderConfig = require('@zeit/next-css/css-loader-config');

const antdVariables = lessToJS(fs.readFileSync(path.resolve(__dirname, '../../src/styles/variables.less'), 'utf8'));
const ANTD_STYLE_REGX = /antd\/.*?\/style.*?/;

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

      // FOR antd
      config.module.rules.push({
        test: /\.less$/,
        include: ANTD_STYLE_REGX,
        use: cssLoaderConfig(config, baseLessConfig),
      });

      // FOR src
      config.module.rules.push({
        test: /\.less$/,
        exclude: ANTD_STYLE_REGX,
        use: cssLoaderConfig(config, {
          ...baseLessConfig,
          extensions: ['less'],
          cssModules: true,
          cssLoaderOptions: {
            ...baseLessConfig.cssLoaderOptions,
            localIdentName: dev ? '[local]--[hash:8]' : '[hash:8]',
          },
        }),
      });

      // for antd less in server (yarn build)
      if (isServer) {
        const rawExternals = [...config.externals];

        config.externals = [
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

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options);
      }

      return config;
    },
  },
});
