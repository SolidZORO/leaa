/* eslint-disable no-underscore-dangle */

const ip = require('ip');
const childProcess = require('child_process');

const { WPCONST } = require('./_const');

const getGitVersion = (childProcess.execSync('git rev-parse HEAD') || '').toString().substr(0, 4);
const getVersion = `v${process.env.npm_package_version} (${getGitVersion})`;

function showEnvInfo() {
  // emoji for CLI
  const serverBaseByText = `${WPCONST.SERVER_PROTOCOL}://${ip.address() || WPCONST.SERVER_HOST}:${WPCONST.SERVER_PORT}`;
  const serverBaseByEmoji = `✨✨ \x1b[00;45;9m${serverBaseByText}\x1b[0m ✨✨`;
  const serverEnv = `${WPCONST.__DEV__ ? '🚀' : '🔰'} ${(WPCONST.__ENV__ || 'NOT-ENV').toUpperCase()}`;

  console.log(
    `\n\n\n\n> 🌈 DEBUG ${WPCONST.DEBUG_MODE === 'true' ? '✅' : '⛔️'}  /  DEMO ${
      WPCONST.DEMO_MODE === 'true' ? '✅' : '⛔'
    }  /  ${WPCONST.__ENV__}  /  ${WPCONST.ENV_FILE_NAME}`,
  );

  console.log(`\n> ${serverEnv}  /  URL ${serverBaseByEmoji}`);

  console.log('\n> 📮 ENVINFO');
  console.log('');
  console.log('     - NAME              ', `${WPCONST.SITE_NAME} ${getVersion}`);
  console.log('     - API               ', `${WPCONST.API_URL}`);
  console.log('');
  console.log('     - PREFIX            ', `${WPCONST.DEV_PREFIX}`);
  console.log('     - CHUNK             ', `${WPCONST.CHUNK_HASH}`);
  console.log('     - PUBLIC_DIR        ', `${WPCONST.PUBLIC_DIR}`);
  console.log('     - BUILD_DIR         ', `${WPCONST.BUILD_DIR}`);
  console.log('\n\n\n');
}

module.exports = { showEnvInfo, getVersion, getGitVersion };
