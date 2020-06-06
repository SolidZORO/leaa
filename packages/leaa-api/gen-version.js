const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const moment = require('moment');

const { getVersion } = require('./tools/cli/get-build-info');

const DIST_PUBLIC_DIR = path.resolve('./public');
const BUILDINFO_PATH = `${DIST_PUBLIC_DIR}/version.txt`;

const buildInfo = {
  BUILDTIME: moment().format('YYYYMMDD-HHmmss'),
  VERSION: getVersion,
};

if (!fs.existsSync(DIST_PUBLIC_DIR)) {
  console.log(`NEED mkdirp ----> ${DIST_PUBLIC_DIR}`);

  mkdirp(DIST_PUBLIC_DIR, (err) => err && console.log(JSON.stringify(err)));
}

console.log('\n\n🌈 DONE-GEN-VERSION-FILE', '\n\n');

fs.writeFileSync(BUILDINFO_PATH, JSON.stringify(buildInfo));
