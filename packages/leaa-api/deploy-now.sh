#! /bin/bash

# LOCAL_TIME=$(date "+%Y-%m-%d %H:%M:%S")

# DEPLOY_HEROKU_APP_NAME="test-leaa-api"
# DEPLOY_COMMIT="update AUTO-DEPLOY ${DEPLOY_HEROKU_APP_NAME} @ ${LOCAL_TIME}"
DEPLOY_DIR="./_deploy"


# DEPLOY_DIR
cp -fr ./serverless/vercel/* ${DEPLOY_DIR}
cd ${DEPLOY_DIR} || exit

vercel --prod -c
