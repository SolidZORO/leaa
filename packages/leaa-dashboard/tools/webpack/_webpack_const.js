const path = require('path');

const webpackConst = {};

// ENV
if (webpackConst.IS_ANALYZER) {
  console.log('\n\n👏👏👏👏 ANALYZER \n\n');
}

webpackConst.__DEV__ = !process.argv.includes('--release');
webpackConst.IS_SERVER = process.argv.includes('--server');
webpackConst.IS_VERBOSE = process.argv.includes('--verbose');
webpackConst.IS_ANALYZER =
  process.argv.includes('--analyze') || process.argv.includes('--analyse') || process.argv.includes('--vvv');

webpackConst.DEV_PREFIX = webpackConst.__DEV__ ? '____' : '';
webpackConst.CHUNK_HASH = webpackConst.__DEV__ ? '_devvvvvvvvvvvv' : '_[chunkhash:8]';
webpackConst.STYLE_CHUNK_HASH = webpackConst.__DEV__ ? '_devvvvvvvvvvvv' : '_[contenthash:8]';
webpackConst.MODE = webpackConst.__DEV__ ? 'development' : 'production';
webpackConst.DEVTOOL = webpackConst.__DEV__
  ? // ? 'eval-source-map'
    // ? 'source-map'
    false
  : false;

// DIR PATH

webpackConst.ROOT_DIR = path.resolve(__dirname, '../../');
webpackConst.SRC_DIR = path.resolve(`${webpackConst.ROOT_DIR}/src`);
webpackConst.PUBLIC_DIR = path.resolve(`${webpackConst.ROOT_DIR}/public`);
webpackConst.NODEMODULES_DIR = path.resolve(`${webpackConst.ROOT_DIR}/node_modules`);
webpackConst.VIEWS_DIR = path.resolve(`${webpackConst.SRC_DIR}/views`);

// BUILD PATH
webpackConst.BUILD_DIR_NAME = webpackConst.__DEV__ ? '.build' : '_dist';

webpackConst.BUILD_DIR = path.resolve(`${webpackConst.ROOT_DIR}/${webpackConst.BUILD_DIR_NAME}`);
webpackConst.BUILD_PUBLIC_DIR = path.resolve(`${webpackConst.BUILD_DIR}`);
webpackConst.BUILD_STATICS_DIR = path.resolve(`${webpackConst.BUILD_PUBLIC_DIR}/statics`);
webpackConst.CDN_STATICS_DIR_URL = '/statics/';

// CHUNK PATH
webpackConst.OUTPUT_SCRIPT_FILENAME = `${webpackConst.DEV_PREFIX}scripts/[name]${webpackConst.CHUNK_HASH}.js`;
webpackConst.OUTPUT_SCRIPT_CHUNK_FILENAME = `${webpackConst.DEV_PREFIX}scripts/chunks/[name]${webpackConst.CHUNK_HASH}.js`;

webpackConst.OUTPUT_STYLE_FILENAME = `${webpackConst.DEV_PREFIX}styles/[name]${webpackConst.STYLE_CHUNK_HASH}.css`;
webpackConst.OUTPUT_STYLE_CHUNK_FILENAME = `${webpackConst.DEV_PREFIX}styles/chunks/[name]${webpackConst.STYLE_CHUNK_HASH}.css`;
webpackConst.OUTPUT_SCRIPT_SOURCEMAP_FILENAME = `${webpackConst.DEV_PREFIX}scripts/maps/[name]${webpackConst.CHUNK_HASH}.js.map`;

// FILE PATH
webpackConst.LOADER_CSS_LOADERR_LOCAL_IDENT_NAME = webpackConst.__DEV__ ? '[local]--[hash:8]' : '[hash:8]';

webpackConst.STATIC_FILE_NAME = webpackConst.__DEV__
  ? '[folder]/[name].[ext]?[hash:8]'
  : '[folder]/[name].[ext]?[hash:8]';

webpackConst.STATIC_ASSET_NAME = webpackConst.__DEV__
  ? '[folder]/[name].[ext]?[hash:8]'
  : '[folder]/[name].[ext]?[hash:8]';

// REGX
webpackConst.REGX_TS = /\.(ts|tsx)$/;
webpackConst.REGX_SCRIPT = /\.(js|jsx)$/;
webpackConst.REGX_STYLE = /\.(less|css|styl|scss|sass|sss)$/;
webpackConst.REGX_MODULE_STYLE = /\.module\.less$/;
webpackConst.REGX_IMAGE = /\.(bmp|gif|jpg|jpeg|png|svg)$/;
webpackConst.REGX_FONT = /\.(woff2|woff|svg|ttf|eot)$/;

// ETC
// eslint-disable-next-line no-underscore-dangle
webpackConst._G_STYLE_FILE = path.resolve(`${webpackConst.SRC_DIR}/styles/_G.less`);
webpackConst.PACKAGE_FILE = path.resolve(`${webpackConst.ROOT_DIR}/package.json`);
webpackConst.TIPS_SPACE = 17;

module.exports = webpackConst;
