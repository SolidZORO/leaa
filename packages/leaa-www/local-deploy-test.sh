#! /bin/bash

cd "$(dirname "$0")" || exit

DEPLOY_DIR="./_deploy"
DIST_DIR="./${DEPLOY_DIR}/_dist"
WWW_DIR="./${DIST_DIR}/leaa-www"

## ROOT DIR
rm -fr ${DEPLOY_DIR} && mkdir -p ${DEPLOY_DIR}

yarn build

cp -fr ./_dist ${DEPLOY_DIR}
cp -fr ./tools ${DEPLOY_DIR}
cp -fr ./package.json ${DEPLOY_DIR}
cp -fr ./serverless/heroku/index.js ${DEPLOY_DIR}

cp -fr ./styles ${WWW_DIR}
cp -fr ./next.config.js ${WWW_DIR}
cp -fr ./configs ${WWW_DIR}/configs

cp -fr ./.next ${WWW_DIR}
cp -fr ./static ${WWW_DIR}

cp -fr ./.env ${WWW_DIR}/.env.production
echo "${DEPLOY_COMMIT}" > ${WWW_DIR}/static/deploy.txt

# DEPLOY DIR
cd ${DEPLOY_DIR} || exit
sed -i '' '/leaa.*0\.0\.1/d' ./package.json
sed -i '' '/build.*tsconfig\.build\.json/d' ./package.json

yarn start









