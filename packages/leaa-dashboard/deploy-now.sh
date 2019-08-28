#! /bin/bash

cd "$(dirname "$0")" || exit

echo "\x1B[95m

   ___  ___   ______ _____  ____  ___   ___  ___ NOW.SH
  / _ \/ _ | / __/ // / _ )/ __ \/ _ | / _ \/ _ \\
 / // / __ |_\ \/ _  / _  / /_/ / __ |/ , _/ // /
/____/_/ |_/___/_//_/____/\____/_/ |_/_/|_/____/


\x1B[0m"

LOCAL_TIME=$(date "+%Y-%m-%d %H:%M:%S")

DEPLOY_HEROKU_APP_NAME="test-leaa-dashboard"
DEPLOY_COMMIT="update AUTO-DEPLOY ${DEPLOY_HEROKU_APP_NAME} @ ${LOCAL_TIME}"
CONFIRM_MESSAGE=$(printf "<%s> \n\n🤖 DEPLOY %s? \n\n(Enter/Esc)" "$(pwd)" "$DEPLOY_HEROKU_APP_NAME")

DEPLOY_DIR="./_deploy"

read -p "${CONFIRM_MESSAGE}" -n 1 -r KEY

if [[ $KEY = "" ]]; then
 # ROOT DIR
    rm -fr ${DEPLOY_DIR} && mkdir -p ${DEPLOY_DIR}

    yarn build

    cp -fr ./_dist/* ${DEPLOY_DIR}

#    cp -fr ./serverless/heroku/* ${DEPLOY_DIR}
    # cp -fr ./serverless/netlify/* ${DEPLOY_DIR}
     cp -fr ./serverless/now/* ${DEPLOY_DIR}

    cp -fr ./public/* ${DEPLOY_DIR}
    echo "${DEPLOY_COMMIT}" > ${DEPLOY_DIR}/deploy.txt


    # DEPLOY DIR
    cd ${DEPLOY_DIR} || exit
    mv robots.example.txt robots.txt

    now -d
else
    echo "CANCEL"
fi









