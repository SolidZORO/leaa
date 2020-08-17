/* eslint-disable no-underscore-dangle, max-len */
const ip = require('ip');
const fs = require('fs');
const path = require('path');
const findUp = require('find-up');
const childProcess = require('child_process');

const pkg = require('../../package.json');

function getGitVersion(len = 4) {
  // support monorepo
  const gitDir = findUp.sync('.git', { type: 'directory' });

  if (!fs.existsSync(gitDir)) return 'nogit';

  return childProcess.execSync('git rev-parse HEAD').toString().substr(0, len) || '0000';
}

const getPkgVersion = {
  VERSION: pkg.version,
  VERSION_DASH: pkg.version.replace(/\./g, '-'),
  VERSION_NUMBER: pkg.version.replace(/\./g, ''),
  VERSION_HASH: getGitVersion(),
};

function showEnvInfo(WPCONST) {
  // emoji for CLI
  const serverBaseByText = `${WPCONST.SERVER_PROTOCOL}://${ip.address() || WPCONST.SERVER_HOST}:${WPCONST.SERVER_PORT}`;
  const serverBaseByEmoji = `✨✨ \x1b[00;45;9m${serverBaseByText}\x1b[0m ✨✨`;
  const serverEnv = `${WPCONST.__DEV__ ? '🚀' : '🔰'}`;

  console.log(
    `\n\n\n\n> 🌈 DEBUG ${WPCONST.DEBUG === 'true' ? '✅' : '✖️'}  /  ${WPCONST.MODE}  /  ${WPCONST.ENV_FILE_NAME}`,
  );
  console.log(`\n> ${serverEnv} URL ${serverBaseByEmoji}`);
  console.log('\n> 📮 ENVINFO');
  // prettier-ignore
  console.log('     - NAME                 ', `${WPCONST.SITE_NAME} ~ v${getPkgVersion.VERSION} (${getPkgVersion.VERSION_HASH})`);
  console.log('');
  console.log('     - CHUNK                ', `${WPCONST.CHUNK_HASH}`);
  console.log('     - PUBLIC_DIR           ', `${WPCONST.PUBLIC_DIR}`);
  console.log('');
  console.log('     - BUILD_DIR            ', `${WPCONST.BUILD_DIR}`);
  console.log('     - OUTPUT_PATH          ', `${WPCONST.OUTPUT_PATH}`);
  console.log('     - OUTPUT_PUBLIC_PATH   ', `${WPCONST.OUTPUT_PUBLIC_PATH}`);
  console.log('\n\n\n');
}

function getEnvFileName(NODE_ENV) {
  // NODE_ENV is process.env.NODE_ENV
  const prodEnv = '_env.js';
  if (!NODE_ENV) return prodEnv;

  return NODE_ENV === 'production' ? prodEnv : `_env.${NODE_ENV}.js`;
}

function getEnvFilePath(NODE_ENV) {
  const ROOT_DIR = path.resolve(__dirname, '../../');
  const ENV_FILE_NAME = getEnvFileName(NODE_ENV);

  const envFilePath = `${ROOT_DIR}/${ENV_FILE_NAME}`;
  // console.log(envFilePath);

  if (NODE_ENV && !fs.existsSync(envFilePath)) {
    console.log('\n');
    console.log(''.padStart(48, '-'));
    console.error(`\n 🔰  Please create file \`${ENV_FILE_NAME}\` first\n`);
    console.log(''.padStart(48, '-'));
    console.log('\n\n');

    process.exit(-1);
  }

  return envFilePath;
}

function getDataByDotenv(NODE_ENV) {
  const ENV_FILE_PATH = getEnvFilePath(NODE_ENV);

  // load _env.js
  // eslint-disable-next-line global-require,import/no-dynamic-require
  return require(ENV_FILE_PATH);
}

module.exports = { showEnvInfo, getDataByDotenv, getEnvFileName, getEnvFilePath, getPkgVersion };
