const dotenv = require('dotenv');
const childProcess = require('child_process');
const ip = require('ip');

const { WPCONST } = require('./_const');

function getEnvInfo() {
  const envPath = `${WPCONST.ROOT_DIR}/${WPCONST.__DEV__ ? '.env' : '.env.production'}`;
  const env = dotenv.config({ path: envPath }).parsed;

  // DEV, Change API_URL to IP Address
  if (WPCONST.__DEV__) env.API_URL = env.API_URL.replace('localhost', ip.address());

  return env;
}

const env = getEnvInfo();
const getGitVersion = (childProcess.execSync('git rev-parse HEAD') || '').toString().substr(0, 4);
const getVersion = `v${process.env.npm_package_version} (${getGitVersion})`;

function showEnvInfo() {
  // emoji for CLI
  const serverBaseByText = `${env.SERVER_PROTOCOL}://${ip.address() || env.SERVER_HOST}:${env.SERVER_PORT}`;
  const serverBaseByEmoji = `✨✨ \x1b[00;45;9m${serverBaseByText}\x1b[0m ✨✨`;
  const serverEnv = `${env.NODE_ENV !== 'production' ? '🚀' : '🔰'} ${(env.NODE_ENV || 'NOT-ENV').toUpperCase()}`;

  console.log(
    `\n\n\n\n> 🌈 DEBUG ${env.DEBUG_MODE === 'true' ? '✅' : '➖'} / DEMO ${env.DEMO_MODE === 'true' ? '✅' : '➖'}`,
  );

  console.log(`\n\n> ${serverEnv} / URL ${serverBaseByEmoji}`);

  console.log('\n> 📮 ENVDATA');
  console.log('     - NAME             ', `${env.SITE_NAME}`);
  console.log('     - VERSION          ', getVersion);
  console.log('');
  console.log('     - API_URL         ', `${env.API_URL}`);
  console.log('');
  console.log('     - DEV_PREFIX       ', `${WPCONST.DEV_PREFIX}`);
  console.log('     - CHUNK_HASH       ', `${WPCONST.CHUNK_HASH}`);
  console.log('     - PUBLIC_DIR       ', `${WPCONST.PUBLIC_DIR}`);
  console.log('     - BUILD_DIR        ', `${WPCONST.BUILD_DIR}`);
  console.log('\n\n\n');
}

module.exports = { showEnvInfo, getVersion, getEnvInfo };
