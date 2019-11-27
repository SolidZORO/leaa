const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const moment = require('moment');

const pkg = require('./package.json');

const DIST_PUBLIC_DIR = path.resolve(__dirname, './public');
const BUILDINFO_PATH = `${DIST_PUBLIC_DIR}/buildinfo.json`;

const buildInfo = {
  TIMESTAMP: moment().format('YYYYMMDD-HHmmss'),
  VERSION: pkg.version,
};

if (!fs.existsSync(DIST_PUBLIC_DIR)) {
  console.log(`NEED mkdirp ----> ${DIST_PUBLIC_DIR}`);

  mkdirp(DIST_PUBLIC_DIR, err => err && console.log(JSON.stringify(err)));
}

fs.writeFileSync(BUILDINFO_PATH, JSON.stringify(buildInfo));
