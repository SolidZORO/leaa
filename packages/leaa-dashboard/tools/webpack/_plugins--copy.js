/* eslint-disable max-len */
const CopyPlugin = require('copy-webpack-plugin');

const { WPCONST } = require('./_const');
const { getEnvFilePath } = require('./__fn');

module.exports = {
  copyPlugins: [
    new CopyPlugin({
      patterns: [
        {
          from: `${WPCONST.PUBLIC_DIR}/assets/**/*`,
          to: `${WPCONST.BUILD_DIR}${WPCONST.OUTPUT_PUBLIC_PATH}`,
          transformPath(targetPath) {
            return `${targetPath}`.replace('public/', '');
          },
          cacheTransform: true,
        },
        {
          from: getEnvFilePath(process.env.NODE_ENV),
          to: `${WPCONST.BUILD_DIR}${WPCONST.OUTPUT_PUBLIC_PATH}`,
          transformPath(targetPath) {
            return `${targetPath}`.replace('public/', '');
          },
          cacheTransform: true,
        },
      ],
    }),
  ].filter(Boolean),
};
