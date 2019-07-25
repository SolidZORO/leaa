module.exports = (nextConfig = {}) => ({
  ...nextConfig,
  ...{
    webpack(config, options) {
      if (!options.defaultLoaders) {
        throw new Error(
          'This plugin is not compatible with Next.js versions below 5.0.0 https://err.sh/next-plugins/upgrade',
        );
      }

      config.module.rules.push({
        test: /\.(jpg|jpeg|png|svg|eot|otf|ttf|woff|woff2)$/,
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

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options);
      }

      return config;
    },
  },
});
