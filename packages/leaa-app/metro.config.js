const path = require('path');
const { createMetroConfiguration } = require('expo-yarn-workspaces');
const { getDefaultConfig } = require('metro-config');
const blacklist = require('metro-config/src/defaults/blacklist');

const baseConfig = createMetroConfiguration(__dirname);
const blacklistRE = blacklist([/packages\/(?!leaa-app|_leaa-common).*/]);

module.exports = (async () => {
  const {
    resolver: { sourceExts },
  } = await getDefaultConfig();

  return {
    ...baseConfig,
    transformer: {
      babelTransformerPath: require.resolve('react-native-less-transformer'),
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: false,
        },
      }),
    },
    resolver: {
      blacklistRE,
      sourceExts: [...sourceExts, 'less'],
      projectRoot: path.resolve(__dirname),
      watchFolders: [path.resolve(__dirname, '..')],
    },
    getProjectRoots() {
      return [path.resolve(__dirname, 'node_modules'), path.resolve('.')];
    },
  };
})();
