#! /bin/bash

cd "$(dirname "$0")" || exit

DEPLOY_DIR="./_deploy"
DIST_DIR="./${DEPLOY_DIR}/_dist"
API_DIR="./${DIST_DIR}/leaa-api"

# ROOT DIR
rm -fr ${DEPLOY_DIR} && mkdir -p ${DEPLOY_DIR}

yarn build

cp -fr ./_dist ${DEPLOY_DIR}

cp -fr ./index.js ${DEPLOY_DIR}
cp -fr ./.env ${DEPLOY_DIR}/.env.production
cp -fr ./package.json ${DEPLOY_DIR}

mkdir -p ${API_DIR}/public
cp -fr ./public/robots.txt ${API_DIR}/public
cp -fr ./public/get-weixin-code.html ${API_DIR}/public
cp -fr ./public/buildinfo.json ${API_DIR}/public

mkdir -p ${API_DIR}/public/assets/divisions
cp -fr ./public/assets/divisions/source ${API_DIR}/public/assets/divisions


# DEPLOY DIR
cd ${DEPLOY_DIR} || exit
sed -i '' '/build.*tsconfig\.build\.json/d' ./package.json

yarn start
