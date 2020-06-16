/* eslint-disable no-underscore-dangle, max-len */
const path = require('path');
const ip = require('ip');
const fs = require('fs');

const __DEV__ = process.env.NODE_ENV !== 'production';
const ROOT_DIR = path.resolve(__dirname, '../../');

const ENV_FILE_NAME = !__DEV__ ? '_env.js' : `_env.${process.env.NODE_ENV}.js`;

function getEnvFilePath() {
  const envFilePath = path.join(ROOT_DIR, ENV_FILE_NAME);

  console.log('ENV_FILE_PATHENV_FILE_PATHENV_FILE_PATHENV_FILE_PATHENV_FILE_PATHENV_FILE_PATH', envFilePath);
  if (process.env.NODE_ENV && !fs.existsSync(envFilePath)) {
    console.log('\n\n', '\n'.padStart(48, '='));
    console.error(`\n🔰  Please create \`${ENV_FILE_NAME}\` file first\n\n`);
    console.log('\n'.padStart(48, '='), '\n\n');

    process.exit(-1);
  }

  return envFilePath;
}

const ENV_FILE_PATH = getEnvFilePath();

console.log('ENV_FILE_PATHENV_FILE_PATHENV_FILE_PATHENV_FILE_PATHENV_FILE_PATHENV_FILE_PATH', ENV_FILE_PATH);

function getEnvData() {
  // eslint-disable-next-line global-require,import/no-dynamic-require
  const env = require(ENV_FILE_PATH);

  // DEV, Change API_URL to IP Address
  if (__DEV__) env.API_URL = env.API_URL.replace('localhost', ip.address());

  return env || {};
}

//
//
//
//

const WPCONST = getEnvData();

WPCONST.__DEV__ = __DEV__;
WPCONST.__PROD__ = !__DEV__;

WPCONST.ENV_FILE_NAME = ENV_FILE_NAME;
WPCONST.ENV_FILE_PATH = ENV_FILE_PATH;

WPCONST.IS_SERVER = process.argv.includes('--server');
WPCONST.IS_VERBOSE = process.argv.includes('--verbose');
WPCONST.IS_SMP = process.argv.includes('--smp');
WPCONST.IS_ANALYZER =
  process.argv.includes('--analyze') ||
  process.argv.includes('--analyse') ||
  process.argv.includes('--vvv') ||
  process.argv.includes('-vvv');
WPCONST.IS_DEBUG = process.argv.includes('--debug');

if (WPCONST.IS_ANALYZER) console.log('\n\n👏👏👏👏 ANALYZER \n\n');

WPCONST.DEV_PREFIX = WPCONST.__DEV__ ? '____' : '';
WPCONST.CHUNK_HASH = WPCONST.__DEV__ ? '-DEV' : '_[chunkhash:4]';
WPCONST.STYLE_CHUNK_HASH = WPCONST.__DEV__ ? '_DEV' : '_[contenthash:4]';
WPCONST.MODE = WPCONST.__DEV__ ? 'development' : 'production';

WPCONST.DEVTOOL = WPCONST.__DEV__ && WPCONST.IS_DEBUG ? 'eval-source-map' : false;
// WPCONST.DEVTOOL = false;
// WPCONST.DEVTOOL = WPCONST.__DEV__ ? 'eval-source-map' : false;

//
// DIR PATH
WPCONST.ROOT_DIR = ROOT_DIR;
WPCONST.SRC_DIR = path.join(WPCONST.ROOT_DIR, 'src');

WPCONST.PUBLIC_DIR = path.join(WPCONST.ROOT_DIR, 'public');
WPCONST.NODEMODULES_DIR = path.join(WPCONST.ROOT_DIR, 'node_modules');
WPCONST.VIEWS_DIR = path.join(WPCONST.SRC_DIR, 'views');

//
// BUILD PATH
WPCONST.BUILD_DIR_NAME = WPCONST.__DEV__ ? '.cache' : '_dist';

// e.g. xxx.com/statics/
WPCONST.OUTPUT_PUBLIC_PATH = '/statics/';

// e.g. /_dist
WPCONST.BUILD_DIR = path.join(WPCONST.ROOT_DIR, WPCONST.BUILD_DIR_NAME);

// e.g. /_dist/statics/
WPCONST.OUTPUT_PATH = path.join(WPCONST.ROOT_DIR, WPCONST.BUILD_DIR_NAME, WPCONST.OUTPUT_PUBLIC_PATH);

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
WPCONST.PACKAGE_FILE = path.join(WPCONST.ROOT_DIR, 'package.json');

module.exports = { WPCONST, getEnvData };
