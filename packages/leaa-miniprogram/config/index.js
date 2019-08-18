const config = {
  projectName: 'leaa-miniprogram',
  date: '2019-8-16',
  designWidth: 750,
  deviceRatio: {
    '640': 2.34 / 2,
    '750': 1,
    '828': 1.81 / 2,
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: {
    babel: {
      sourceMap: true,
      presets: [
        [
          'env',
          {
            modules: false,
          },
        ],
      ],
      plugins: [
        'transform-decorators-legacy',
        'transform-class-properties',
        'transform-object-rest-spread',
        [
          'module-resolver',
          {
            root: ['./'],
            alias: {
              '@leaa/common': '../_leaa-common/src',
              '@leaa/miniprogram': './src',
            },
            extensions: ['.ts', '.tsx'],
          },
        ],
      ],
    },
  },
  defineConstants: {},
  copy: {
    patterns: [],
    options: {},
  },
  weapp: {
    module: {
      postcss: {
        autoprefixer: {
          enable: true,
          config: {
            browsers: ['last 3 versions', 'Android >= 4.1', 'ios >= 8'],
          },
        },
        pxtransform: {
          enable: true,
          config: {},
        },
        url: {
          enable: true,
          config: {
            limit: 10240, // 设定转换尺寸上限
          },
        },
        cssModules: {
          enable: true,
          config: {
            // namingPattern: 'module', // 转换模式，取值为 global/module
            generateScopedName: '[local]--[hash:8]',
          },
        },
        npm: {
          dir: './',
        },
      },
    },
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    module: {
      postcss: {
        autoprefixer: {
          enable: true,
          config: {
            browsers: ['last 3 versions', 'Android >= 4.1', 'ios >= 8'],
          },
        },
        cssModules: {
          enable: true,
          config: {
            // namingPattern: 'module', // 转换模式，取值为 global/module
            generateScopedName: '[local]--[hash:8]',
          },
        },
        router: {
          mode: 'browser', // hash | browser
        },
      },
    },
  },
};

// eslint-disable-next-line func-names
module.exports = function(merge) {
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line global-require
    return merge({}, config, require('./dev'));
  }

  // eslint-disable-next-line global-require
  return merge({}, config, require('./prod'));
};
