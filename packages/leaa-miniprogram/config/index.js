const path = require('path');

const alias = {
  '@leaa/miniprogram': path.resolve(__dirname, '..'),
};

const config = {
  projectName: '@leaa/miniprogram',
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
      presets: [['env', { modules: false }]],
      plugins: ['transform-decorators-legacy', 'transform-class-properties', 'transform-object-rest-spread'],
    },
  },
  defineConstants: {},
  alias,
  copy: {
    patterns: [],
    options: {},
  },
  weapp: {
    npm: {
      dir: '../dist',
    },
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
            // namingPattern 配置取值分别如下：
            // global，表示全局转换，所有样式文件都会经过 CSS Modules 转换处理，除了文件名中包含 .global. 的样式文件
            // module，表示自定义转换，只有文件名中包含 .module. 的样式文件会经过 CSS Modules 转换处理
            namingPattern: 'global',
            generateScopedName: '[local]--[hash:8]',
          },
        },
      },
    },
  },
  // h5: {
  //   publicPath: '/',
  //   staticDirectory: 'static',
  //   module: {
  //     postcss: {
  //       autoprefixer: {
  //         enable: true,
  //         config: {
  //           browsers: ['last 3 versions', 'Android >= 4.1', 'ios >= 8'],
  //         },
  //       },
  //       cssModules: {
  //         enable: true,
  //         config: {
  //           // namingPattern 配置取值分别如下：
  //           // global，表示全局转换，所有样式文件都会经过 CSS Modules 转换处理，除了文件名中包含 .global. 的样式文件
  //           // module，表示自定义转换，只有文件名中包含 .module. 的样式文件会经过 CSS Modules 转换处理
  //           namingPattern: 'global',
  //           generateScopedName: '[local]--[hash:8]',
  //         },
  //       },
  //     },
  //   },
  // },
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
