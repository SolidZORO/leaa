const { createMetroConfiguration } = require('expo-yarn-workspaces');
const { getDefaultConfig } = require('metro-config');

const baseConfig = createMetroConfiguration(__dirname);

module.exports = (async () => {
  const {
    resolver: { sourceExts },
  } = await getDefaultConfig();
  return {
    ...baseConfig,
    transformer: {
      babelTransformerPath: require.resolve('react-native-less-transformer'),
    },
    resolver: {
      sourceExts: [...sourceExts, 'less'],
    },
  };
})();
