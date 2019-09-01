const { getDefaultConfig } = require('metro-config');

module.exports = (async () => {
  const {
    resolver: { sourceExts },
  } = await getDefaultConfig();
  return {
    transformer: {
      babelTransformerPath: require.resolve('react-native-less-transformer'),
    },
    resolver: {
      sourceExts: [...sourceExts, 'less'],
    },
  };
})();
