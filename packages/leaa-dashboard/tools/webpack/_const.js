/* eslint-disable no-underscore-dangle, max-len */
const path = require('path');

const WPCONST = {};

// ENV
if (WPCONST.IS_ANALYZER) {
  console.log('\n\n👏👏👏👏 ANALYZER \n\n');
}

WPCONST.__DEV__ = !process.argv.includes('--release');
WPCONST.__PROD__ = process.argv.includes('--release');
WPCONST.IS_SERVER = process.argv.includes('--server');
WPCONST.IS_VERBOSE = process.argv.includes('--verbose');
WPCONST.IS_SMP = process.argv.includes('--smp');
WPCONST.IS_ANALYZER =
  process.argv.includes('--analyze') ||
  process.argv.includes('--analyse') ||
  process.argv.includes('--vvv') ||
  process.argv.includes('-vvv');
WPCONST.IS_DEBUG = process.argv.includes('--debug');

WPCONST.DEV_PREFIX = WPCONST.__DEV__ ? '____' : '';
WPCONST.CHUNK_HASH = WPCONST.__DEV__ ? '-DEV' : '_[chunkhash:4]';
WPCONST.STYLE_CHUNK_HASH = WPCONST.__DEV__ ? '_DEV' : '_[contenthash:4]';
WPCONST.MODE = WPCONST.__DEV__ ? 'development' : 'production';

WPCONST.DEVTOOL = WPCONST.__DEV__ && WPCONST.IS_DEBUG ? 'eval-source-map' : false;
// WPCONST.DEVTOOL = false;
// WPCONST.DEVTOOL = WPCONST.__DEV__ ? 'eval-source-map' : false;

//
// DIR PATH
WPCONST.ROOT_DIR = path.resolve(__dirname, '../../');
WPCONST.SRC_DIR = path.resolve(`${WPCONST.ROOT_DIR}/src`);
WPCONST.PUBLIC_DIR = path.resolve(`${WPCONST.ROOT_DIR}/public`);
WPCONST.NODEMODULES_DIR = path.resolve(`${WPCONST.ROOT_DIR}/node_modules`);
WPCONST.VIEWS_DIR = path.resolve(`${WPCONST.SRC_DIR}/views`);

//
// BUILD PATH
WPCONST.BUILD_DIR_NAME = WPCONST.__DEV__ ? '.cache' : '_build';

WPCONST.CDN_DIR_URL = '/statics';
WPCONST.BUILD_DIR = path.resolve(`${WPCONST.ROOT_DIR}/${WPCONST.BUILD_DIR_NAME}`);
// WPCONST.BUILD_PUBLIC_DIR = path.resolve(`${WPCONST.BUILD_DIR}/public`);
WPCONST.BUILD_STATICS_DIR = path.resolve(`${WPCONST.BUILD_DIR}${WPCONST.CDN_DIR_URL}`);

//
// CHUNK PATH
WPCONST.OUTPUT_SCRIPT_FILENAME = `${WPCONST.DEV_PREFIX}scripts/[name]${WPCONST.CHUNK_HASH}.js`;
WPCONST.OUTPUT_SCRIPT_CHUNK_FILENAME = `${WPCONST.DEV_PREFIX}scripts/[name]${WPCONST.CHUNK_HASH}.js`;

WPCONST.OUTPUT_STYLE_FILENAME = `${WPCONST.DEV_PREFIX}styles/[name]${WPCONST.STYLE_CHUNK_HASH}.css`;
WPCONST.OUTPUT_STYLE_CHUNK_FILENAME = `${WPCONST.DEV_PREFIX}styles/[name]${WPCONST.STYLE_CHUNK_HASH}.css`;
WPCONST.OUTPUT_SCRIPT_SOURCEMAP_FILENAME = `${WPCONST.DEV_PREFIX}scripts/maps/[name][file][query]${WPCONST.CHUNK_HASH}.js.map`;

//
// FILE PATH
WPCONST.LOADER_CSS_LOADERR_LOCAL_IDENT_NAME = WPCONST.__DEV__ ? '[local]--[hash:4]' : '[hash:4]';
WPCONST.STATIC_FILE_NAME = WPCONST.__DEV__ ? '[folder]/[name].[ext]?[hash:8]' : '[folder]/[name].[ext]?[hash:8]';
WPCONST.STATIC_ASSET_NAME = WPCONST.__DEV__ ? '[folder]/[name].[ext]?[hash:8]' : '[folder]/[name].[ext]?[hash:8]';

//
// REGX
WPCONST.REGX_TS = /\.(ts|tsx)$/;
WPCONST.REGX_SCRIPT = /\.(js|jsx)$/;
WPCONST.REGX_SCRIPT_MAP = /\.(js|jsx)\.map$/;
WPCONST.REGX_STYLE = /\.(less|css|styl|scss|sass|sss)$/;
WPCONST.REGX_MODULE_STYLE = /\.module\.less$/;
WPCONST.REGX_IMAGE = /\.(bmp|gif|jpg|jpeg|png|svg)$/;
WPCONST.REGX_FONT = /\.(woff2|woff|ttf|eot)$/;

//
// ETC
// eslint-disable-next-line no-underscore-dangle
WPCONST.PACKAGE_FILE = path.resolve(`${WPCONST.ROOT_DIR}/package.json`);

module.exports = { WPCONST };
