/* eslint-disable no-underscore-dangle, max-len */
const _ = require('lodash');
const path = require('path');
const { getDataByDotenv, getEnvFileName } = require('./__fn');

//
// ENV
const ENV_DATA = getDataByDotenv(process.env.NODE_ENV);
const WPCONST = _.clone(ENV_DATA);

WPCONST.ENV_FILE_NAME = getEnvFileName(process.env.NODE_ENV);

const __DEV__ = process.env.NODE_ENV !== 'production';
const __PROD__ = !__DEV__;
WPCONST.__DEV__ = __DEV__;
WPCONST.__PROD__ = __PROD__;

WPCONST.IS_SERVER = process.argv.includes('--server');
WPCONST.IS_ANALYZER = process.argv.includes('--vvv') || process.argv.includes('--analyzer');
WPCONST.IS_DEBUG = process.argv.includes('--debug');

//
// CHUNK
WPCONST.CHUNK_HASH = __DEV__ ? '_DEV' : '_[chunkhash:4]';
WPCONST.STYLE_CHUNK_HASH = __DEV__ ? '_DEV' : '_[contenthash:4]';

WPCONST.MODE = __DEV__ ? 'development' : 'production';
WPCONST.DEVTOOL = __DEV__ && WPCONST.IS_DEBUG ? 'eval-source-map' : false;

//
// DIR PATH
const ROOT_DIR = path.resolve(__dirname, '../../');

WPCONST.ROOT_DIR = ROOT_DIR;
WPCONST.SRC_DIR = path.join(ROOT_DIR, 'src');
WPCONST.PUBLIC_DIR = path.join(ROOT_DIR, 'public');
WPCONST.NODEMODULES_DIR = path.join(ROOT_DIR, 'node_modules');

WPCONST.VIEWS_DIR = path.join(WPCONST.SRC_DIR, 'views');
WPCONST.PAGES_DIR = path.join(WPCONST.SRC_DIR, 'pages');
WPCONST.BUILD_DIR_NAME = __DEV__ ? '.cache' : '_dist';

// for react-router
WPCONST.OUTPUT_PUBLIC_PATH = !process.env.ROUTER_BASENAME ? '/' : `${process.env.ROUTER_BASENAME}/`;

// e.g. /_dist
WPCONST.BUILD_DIR = path.join(WPCONST.ROOT_DIR, WPCONST.BUILD_DIR_NAME);

// e.g. /_dist/statics/
WPCONST.OUTPUT_PATH = path.join(WPCONST.ROOT_DIR, WPCONST.BUILD_DIR_NAME, WPCONST.OUTPUT_PUBLIC_PATH);

//
// CHUNK PATH
WPCONST.OUTPUT_SCRIPT_FILENAME = `scripts/[name]${WPCONST.CHUNK_HASH}.js`;
WPCONST.OUTPUT_SCRIPT_CHUNK_FILENAME = `scripts/[name]${WPCONST.CHUNK_HASH}.js`;

WPCONST.OUTPUT_STYLE_FILENAME = `styles/[name]${WPCONST.STYLE_CHUNK_HASH}.css`;
WPCONST.OUTPUT_STYLE_CHUNK_FILENAME = `styles/[name]${WPCONST.STYLE_CHUNK_HASH}.css`;
WPCONST.OUTPUT_SCRIPT_SOURCEMAP_FILENAME = `scripts/maps/[name][file][query]${WPCONST.CHUNK_HASH}.js.map`;

//
// FILE PATH
WPCONST.LOADER_CSS_LOADERR_LOCAL_IDENT_NAME = __DEV__ ? '[local]--[hash:8]' : '[hash:4]';
WPCONST.STATIC_FILE_NAME = __DEV__ ? '[folder]/[name]_DEV.[ext]?[hash:4]' : '[folder]/[name].[ext]?[hash:4]';
WPCONST.STATIC_ASSET_NAME = __DEV__ ? '[folder]/[name]_DEV.[ext]?[hash:4]' : '[folder]/[name].[ext]?[hash:4]';

//
// REGX
WPCONST.REGX_SCRIPT = /\.(js|ts|jsx|tsx)$/;
WPCONST.REGX_SCRIPT_MAP = /\.(js|jsx)\.map$/;
WPCONST.REGX_STYLE = /\.(less|css|styl|scss|sass|sss)$/;
WPCONST.REGX_IMAGE = /\.(bmp|gif|jpg|jpeg|png|svg)$/;
WPCONST.REGX_FONT = /\.(woff2|woff|ttf|eot)$/;

//
// ETC
WPCONST.PKG_FILE = path.resolve(`${WPCONST.ROOT_DIR}/package.json`);

module.exports = { ENV_DATA, WPCONST };
