const withBundleAnalyzer = require('@zeit/next-bundle-analyzer');

const analyzerConfig = {
  analyzerMode: 'server',
  analyzerHost: 'localhost',
  analyzerPort: 1777,
  openAnalyzer: true,
  generateStatsFile: false,
  statsFilename: 'stats.json',
  statsOptions: null,
  logLevel: 'info',
};

module.exports = (nextConfig) =>
  withBundleAnalyzer({
    analyzeServer: ['server', 'both'].includes(process.env.BUNDLE_ANALYZE),
    analyzeBrowser: ['browser', 'both'].includes(process.env.BUNDLE_ANALYZE),
    bundleAnalyzerConfig: {
      server: {
        ...{ analyzerConfig },
        analyzerPort: 1666,
        reportFilename: '../_bundles/server.html',
      },
      browser: {
        ...{ analyzerConfig },
        analyzerPort: 1777,
        reportFilename: '../_bundles/client.html',
      },
    },
    webpack(config, options) {
      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options);
      }

      return config;
    },
  });
