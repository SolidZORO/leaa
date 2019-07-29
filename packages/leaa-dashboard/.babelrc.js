module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false,
        useBuiltIns: 'usage',
        corejs: 3,
      },
    ],
    ['@babel/preset-react'],
    ['@babel/preset-typescript'],
  ],
  plugins: [
    //
    // PROPOSAL
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    ['@babel/plugin-proposal-export-default-from'],
    ['@babel/plugin-proposal-object-rest-spread'],
    //
    // SYNTAX
    ['@babel/plugin-syntax-dynamic-import'],
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
        root: ['./src'],
        alias: {
          '@leaa/common': '../_leaa-common/src',
          '@leaa/dashboard': './src',
        },
        extensions: ['.ts', '.tsx'],
      },
    ],
  ],
  ignore: ['node_modules', 'logs', '_build'],
};
