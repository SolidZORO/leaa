#! /bin/bash

LOCAL_TIME=$(date "+%Y-%m-%d %H:%M:%S")

DEPLOY_HEROKU_APP_NAME="test-leaa-api"
DEPLOY_COMMIT="update AUTO-DEPLOY ${DEPLOY_HEROKU_APP_NAME} @ ${LOCAL_TIME}"
DEPLOY_DIR="./_deploy"


# DEPLOY_DIR
cd ${DEPLOY_DIR} || exit

sed -i '' '/build.*tsconfig\.build\.json/d' ./package.json
git init
git remote add heroku https://git.heroku.com/${DEPLOY_HEROKU_APP_NAME}.git
git add -A
git commit -m "${DEPLOY_COMMIT}"
git push -f heroku master





