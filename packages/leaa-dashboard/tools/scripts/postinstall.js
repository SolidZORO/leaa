const fs = require('fs');
const path = require('path');

const EXAMPLE_DOTENT_FILE = path.resolve(__dirname, '../../.env.example');
//
const PROD_DOTENT_FILE = path.resolve(__dirname, '../../.env');
const DEV_DOTENT_FILE = path.resolve(__dirname, '../../.env.development');

function copyEnv(DOTENV_PATH) {
  if (fs.existsSync(DOTENV_PATH)) {
    console.log(`skip ${DOTENV_PATH}`);
    return;
  }

  try {
    fs.copyFileSync(EXAMPLE_DOTENT_FILE, DOTENV_PATH);
    console.log(`success copy ${DOTENV_PATH}`);
  } catch (err) {
    console.error(`failed copy ${DOTENV_PATH}`, err);
  }
}

function initEnv() {
  if (fs.existsSync(DEV_DOTENT_FILE) && fs.existsSync(PROD_DOTENT_FILE)) {
    return;
  }

  if (!fs.existsSync(EXAMPLE_DOTENT_FILE)) {
    console.log(`\n missing ${EXAMPLE_DOTENT_FILE} \n`);
    return;
  }

  console.log('\n');

  copyEnv(DEV_DOTENT_FILE);
  copyEnv(PROD_DOTENT_FILE);

  console.log('\n\n✅ initEnv Success.\n\n');
}

initEnv();
