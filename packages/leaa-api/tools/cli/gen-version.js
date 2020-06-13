const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const moment = require('moment');
const childProcess = require('child_process');

const pkg = require('../../package.json');

const getGitVersion = (childProcess.execSync('git rev-parse HEAD') || '').toString().substr(0, 4);
const getProjectVersion = pkg.version;
const getVersion = `v${getProjectVersion} (${getGitVersion})`;

const DIST_PUBLIC_DIR = path.resolve(__dirname, '../../public');
const DIST_FILE_PATH = `${DIST_PUBLIC_DIR}/version.txt`;

const buildInfo = {
  VERSION: getVersion,
  BUILDTIME: moment().format('YYYYMMDD-HHmmss'),
};

if (!fs.existsSync(DIST_PUBLIC_DIR)) {
  console.log(`NEED mkdirp ----> ${DIST_PUBLIC_DIR}`);

  mkdirp(DIST_PUBLIC_DIR, (err) => err && console.log(JSON.stringify(err)));
}

console.log('\n\n🌈 DONE-GEN-VERSION-FILE', '\n\n');

fs.writeFileSync(DIST_FILE_PATH, JSON.stringify(buildInfo));
