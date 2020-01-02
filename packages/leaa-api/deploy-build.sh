#! /bin/bash

cd "$(dirname "$0")" || exit

echo "\x1B[96m

   ___   ___  ____ ${1}
  / _ | / _ \/  _/
 / __ |/ ___// /
/_/ |_/_/  /___/


\x1B[0m"

LOCAL_TIME=$(date "+%Y-%m-%d %H:%M:%S")

DEPLOY_HEROKU_APP_NAME="test-leaa-api"
DEPLOY_COMMIT="update AUTO-DEPLOY ${DEPLOY_HEROKU_APP_NAME} @ ${LOCAL_TIME}"
CONFIRM_MESSAGE=$(printf "<%s> \n\n🤖 DEPLOY %s? \n\n(Enter/Esc)" "$(pwd)" "$DEPLOY_HEROKU_APP_NAME")

DEPLOY_DIR="./_deploy"
DIST_DIR="./${DEPLOY_DIR}/_dist"
API_DIR="./${DIST_DIR}/leaa-api"

read -p "${CONFIRM_MESSAGE}" -n 1 -r KEY

if [[ $KEY = "" ]]; then
    # ROOT DIR
    rm -fr ${DEPLOY_DIR} && mkdir -p ${DEPLOY_DIR}

    yarn build

    cp -fr ./_dist ${DEPLOY_DIR}

    cp -fr ./index.js ${DEPLOY_DIR}
    cp -fr ./.env.production ${DEPLOY_DIR}
    cp -fr ./package.json ${DEPLOY_DIR}

    mkdir -p ${API_DIR}/public
    cp -fr ./public/robots.txt ${API_DIR}/public
    cp -fr ./public/get-weixin-code.html ${API_DIR}/public
    cp -fr ./public/buildinfo.json ${API_DIR}/public

    mkdir -p ${API_DIR}/public/assets/divisions
    cp -fr ./public/assets/divisions/source ${API_DIR}/public/assets/divisions
else
    echo "CANCEL"
fi









