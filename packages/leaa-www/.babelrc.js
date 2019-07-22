module.exports = {
  presets: [['next/babel']],
  plugins: [
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
  ignore: ['node_modules', 'logs', '_build', '_deploy', '_tsc', '.dist', '.deploy', '.docker'],
};
