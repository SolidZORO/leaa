#! /bin/bash

cd "$(dirname "$0")" || exit

DEPLOY_DIR="./_deploy"
DIST_DIR="./${DEPLOY_DIR}/_build"
WWW_DIR="./${DIST_DIR}/leaa-www"

## ROOT DIR
rm -fr ${DEPLOY_DIR} && mkdir -p ${DEPLOY_DIR}

yarn build

cp -fr ./_build ${DEPLOY_DIR}
cp -fr ./package.json ${DEPLOY_DIR}
cp -fr ./index.js ${DEPLOY_DIR}

#cp -fr ./styles ${WWW_DIR}
#cp -fr ./next.config.js ${WWW_DIR}
#cp -fr ./configs/*.js ${WWW_DIR}/configs
cp -fr ./tools ${WWW_DIR}
cp -fr ./.next ${WWW_DIR}
cp -fr ./public ${WWW_DIR}

cp -fr ./.env ${WWW_DIR}/.env.production
echo "${DEPLOY_COMMIT}" > ${WWW_DIR}/public/deploy.txt

# DEPLOY DIR
cd ${DEPLOY_DIR} || exit
sed -i '' '/@leaa\/.*[0-9]\./d' ./package.json
sed -i '' '/build.*tsconfig\.build\.json/d' ./package.json

yarn start
