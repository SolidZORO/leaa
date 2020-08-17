const fs = require('fs');
const mkdirp = require('mkdirp');
const moment = require('moment');

const { WPCONST } = require('../webpack/_const');
const { getPkgVersion } = require('../webpack/__fn');

const DIST_PUBLIC_DIR = WPCONST.PUBLIC_DIR;
const DIST_FILE_PATH = `${DIST_PUBLIC_DIR}/version.txt`;

const buildInfo = {
  ...getPkgVersion,
  BUILDTIME: moment().format('YYYYMMDD-HHmmss'),
};

if (!fs.existsSync(DIST_PUBLIC_DIR)) {
  const maked = mkdirp.sync(DIST_PUBLIC_DIR);
  console.log(`made directories, starting with ${maked}`);
}

console.log(`\n\n🌈 DONE-OUTPUT-VERSION-FILE to ${DIST_FILE_PATH}`, '\n\n');

fs.writeFileSync(DIST_FILE_PATH, JSON.stringify(buildInfo));
