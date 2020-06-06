const childProcess = require('child_process');

const getGitVersion = (childProcess.execSync('git rev-parse HEAD') || '').toString().substr(0, 4);
const getProjectVersion = process.env.npm_package_version;
const getVersion = `v${getProjectVersion} (${getGitVersion})`;

module.exports = { getGitVersion, getProjectVersion, getVersion };
