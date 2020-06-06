const childProcess = require('child_process');
const pkg = require('../../package.json');

const getGitVersion = (childProcess.execSync('git rev-parse HEAD') || '').toString().substr(0, 4);
const getProjectVersion = pkg.version;
const getVersion = `v${getProjectVersion} (${getGitVersion})`;

module.exports = { getGitVersion, getProjectVersion, getVersion };
