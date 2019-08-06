module.exports = {
  presets: [['next/babel']],
  plugins: [
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
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@leaa/common': '../_leaa-common/src',
          '@leaa/www': './',
        },
        extensions: ['.ts', '.tsx'],
      },
    ],
  ],
  ignore: ['node_modules', 'logs', '_build', '_deploy', '_tsc', '_dist', '.docker'],
};
