module.exports = {
  presets: [['next/babel']],
  plugins: [
    ['@babel/plugin-proposal-optional-chaining'],
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    ['lodash'],
    [
      'import',
      {
        libraryName: 'antd',
        libraryDirectory: 'lib',
        style: true,
      },
    ],
  ],
  ignore: ['node_modules', 'logs', '_build', '_deploy', '_tsc', '_dist', '.docker'],
};
