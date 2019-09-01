module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-classname-to-style',
      ['react-native-platform-specific-extensions', { extensions: ['less'] }],
      [
        'module-resolver',
        {
          root: ['.'],
          alias: {
            '@leaa/app': './',
            '@styles': './src/styles',
          },
        },
      ],
    ],
  };
};
