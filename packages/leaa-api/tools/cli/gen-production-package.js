const fs = require('fs');
const path = require('path');
const _ = require('lodash');

const pkg = require('../../package.json');

const DIST_FILE_PATH = path.resolve(__dirname, '../deploy-config/server/deploy_repo_package.json');

const nextPkg = pkg;
delete nextPkg.devDependencies;

// save `pm2` to dependencies
nextPkg.dependencies.pm2 = '^4.4.0';

nextPkg.scripts = _.pick(pkg.scripts, ['docker-install', 'docker-start', 'docker-pm2-test', 'seed', 'start']);

fs.writeFileSync(DIST_FILE_PATH, JSON.stringify(nextPkg, null, 2));
