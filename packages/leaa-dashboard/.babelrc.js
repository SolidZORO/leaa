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
    ['@babel/plugin-proposal-optional-chaining'],
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
        libraryDirectory: 'es',
        style: true,
      },
    ],
    ['@babel/plugin-transform-runtime'],
  ],
  ignore: [
    'node_modules',
    'logs',
    '.cache',
    '_cache',
    'cache',
    '.build',
    '_build',
    'build',
    '.dist',
    '_dist',
    'dist',
    '.deploy',
    '_deploy',
    'deploy',
  ],
};
