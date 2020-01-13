const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');


const NOW_JSON_PATH = path.resolve(__dirname, './now.json');
const DOTENV_PRODUCTION_PATH = path.resolve(__dirname, '../../.env.production');
const BUILDINFO_PATH = path.resolve(__dirname, '../../../../now-www.json');


const dotenvProduct = dotenv.config({ path: DOTENV_PRODUCTION_PATH }).parsed;
const env = JSON.parse(fs.readFileSync(NOW_JSON_PATH).toString());

env.env = {
  ...env.env,
  ...dotenvProduct
};

console.log('\n\n---- GEN NOW DOTENV ----\n\n', env.env, '\n\n');

fs.writeFileSync(BUILDINFO_PATH, JSON.stringify(env, null, 2));
