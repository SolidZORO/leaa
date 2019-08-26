#! /bin/bash

cd "$(dirname "$0")" || exit

echo "\x1B[96m

   ___   ___  ____
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
    echo "${DEPLOY_COMMIT}" > ${API_DIR}/public/deploy.txt


    # DEPLOY DIR
    cd ${DEPLOY_DIR} || exit
    sed -i '' '/@leaa\/.*[0-9]\./d' ./package.json
    sed -i '' '/build.*tsconfig\.build\.json/d' ./package.json

    git init
    git remote add heroku https://git.heroku.com/${DEPLOY_HEROKU_APP_NAME}.git
    git add -A
    git commit -m "${DEPLOY_COMMIT}"
    git push -f heroku master
else
    echo "CANCEL"
fi









