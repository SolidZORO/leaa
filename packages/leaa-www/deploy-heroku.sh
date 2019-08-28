#! /bin/bash

cd "$(dirname "$0")" || exit

echo "\x1B[93m

 _      ___      ___      __ HEROKU
| | /| / / | /| / / | /| / /
| |/ |/ /| |/ |/ /| |/ |/ /
|__/|__/ |__/|__/ |__/|__/


\x1B[0m"

LOCAL_TIME=$(date "+%Y-%m-%d %H:%M:%S")

DEPLOY_HEROKU_APP_NAME="test-leaa-www"
DEPLOY_COMMIT="update AUTO-DEPLOY ${DEPLOY_HEROKU_APP_NAME} @ ${LOCAL_TIME}"
CONFIRM_MESSAGE=$(printf "<%s> \n\n🤖 DEPLOY %s? \n\n(Enter/Esc)" "$(pwd)" "$DEPLOY_HEROKU_APP_NAME")

DEPLOY_DIR="./_deploy"
DIST_DIR="./${DEPLOY_DIR}/_dist"
WWW_DIR="./${DIST_DIR}/leaa-www"

read -p "${CONFIRM_MESSAGE}" -n 1 -r KEY

if [[ $KEY = "" ]]; then
    ## ROOT DIR
    rm -fr ${DEPLOY_DIR} && mkdir -p ${DEPLOY_DIR}

    yarn build

    cp -fr ./_dist ${DEPLOY_DIR}
    cp -fr ./package.json ${DEPLOY_DIR}
    cp -fr ./index.js ${DEPLOY_DIR}

    cp -fr ./styles ${WWW_DIR}
    cp -fr ./next.config.js ${WWW_DIR}
    cp -fr ./configs/*.js ${WWW_DIR}/configs

    cp -fr ./.next ${WWW_DIR}
    cp -fr ./static ${WWW_DIR}

    cp -fr ./.env.production ${WWW_DIR}
    echo "${DEPLOY_COMMIT}" > ${WWW_DIR}/static/deploy.txt

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










