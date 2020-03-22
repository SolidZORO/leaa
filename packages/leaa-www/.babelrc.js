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
  ignore: [
    "node_modules",
    //
    "/.cache",
    "/_cache",
    "/cache",
    //
    "/.build",
    "/_build",
    "/build",
    //
    "/.dist",
    "/_dist",
    "/dist",
    //
    "/.deploy",
    "/_deploy",
    "/deploy",
    //
    'logs',
    '_tsc',
    '.docker'
  ],
};
