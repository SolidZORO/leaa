const webpackAnalyzerConfig = {
  // Can be `server`, `static` or `disabled`.
  analyzerMode: 'server',
  // Host that will be used in `server` mode to start HTTP server.
  analyzerHost: 'localhost',
  // Port that will be used in `server` mode to start HTTP server.
  analyzerPort: 1777,
  reportFilename: 'report.html',
  // defaultSizes: 'parsed',
  openAnalyzer: true,
  generateStatsFile: false,
  statsFilename: 'stats.json',
  statsOptions: null,
  // Log level. Can be 'info', 'warn', 'error' or 'silent'.
  logLevel: 'info',
};

module.exports = webpackAnalyzerConfig;
