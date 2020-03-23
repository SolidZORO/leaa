const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const moment = require('moment');

const DIST_PUBLIC_DIR = path.resolve(__dirname, './public');
const BUILDINFO_PATH = `${DIST_PUBLIC_DIR}/buildinfo.json`;

const buildInfo = {
  BUILDTIME: moment().format('YYYYMMDD-HHmmss'),
  VERSION: `v${process.env.npm_package_version}`,
};

if (!fs.existsSync(DIST_PUBLIC_DIR)) {
  console.log(`NEED mkdirp ----> ${DIST_PUBLIC_DIR}`);

  mkdirp(DIST_PUBLIC_DIR, (err) => err && console.log(JSON.stringify(err)));
}

fs.writeFileSync(BUILDINFO_PATH, JSON.stringify(buildInfo));
