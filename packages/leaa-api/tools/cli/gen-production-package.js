const fs = require('fs');
const path = require('path');
const _ = require('lodash');

const pkg = require('../../package.json');

const DIST_FILE_PATH = path.resolve(__dirname, '../deploy-config/ecs/package.json');

const nextPkg = pkg;
delete nextPkg.devDependencies;
nextPkg.scripts = _.pick(pkg.scripts, ['docker-install', 'docker-start', 'seed', 'start']);

fs.writeFileSync(DIST_FILE_PATH, JSON.stringify(nextPkg, null, 2));
