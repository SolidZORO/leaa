const { WPCONST } = require('./_const');

const { scriptModule } = require('./_modules--script');
const { styleModule } = require('./_modules--style');

const modules = {
  strictExportPresence: false,
};

modules.rules = [
  scriptModule,
  styleModule,
  //
  // FILE
  {
    test: WPCONST.REGX_SCRIPT_MAP,
    rules: [{ loader: 'file-loader' }],
  },
  //
  // IMAGE
  {
    test: WPCONST.REGX_IMAGE,
    exclude: [/src[\\/]assets[\\/]fonts/],
    use: [
      {
        loader: 'url-loader',
        options: {
          limit: 8192,
          name: `images/${WPCONST.STATIC_ASSET_NAME}`,
        },
      },
    ],
  },
  //
  // FONT
  {
    test: WPCONST.REGX_FONT,
    // include: /src[\\/]assets[\\/]fonts/,
    use: [
      {
        loader: 'url-loader',
        options: {
          limit: 8192,
          name: 'fonts/[folder]/[name].[ext]?[hash:8]',
        },
      },
    ],
  },
];

module.exports = { modules };
