module.exports = {
  presets: [
    ['@babel/preset-env', {
      'targets': {
        'node': 'current',
      },
    }],
    ['@babel/preset-typescript'],
  ],
  plugins: [
    ['@babel/plugin-proposal-decorators', { 'legacy': true }],
    ['@babel/plugin-proposal-class-properties', { 'loose': true }],
    ['@babel/plugin-proposal-export-default-from'],
    ['@babel/plugin-syntax-dynamic-import'],
    ['lodash'],
  ],
  ignore: [
    'node_modules',
    '_build',
    '_deploy',
    '_deploy-api',
    '_tsc',
  ],
};

