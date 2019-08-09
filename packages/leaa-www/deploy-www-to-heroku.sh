#! /bin/bash

cd $(dirname "$0")

LOCAL_TIME=`date '+%Y-%m-%d %H:%M:%S'`

DEPLOY_DIR="./_deploy"
DIST_DIR="./${DEPLOY_DIR}/_dist"
WWW_DIR="./${DEPLOY_DIR}/_dist/leaa-www"
DEPLOY_HEROKU_APP_NAME='test-leaa-www'
DEPLOY_COMMIT="update AUTO-DEPLOY ${DEPLOY_HEROKU_APP_NAME} @ ${LOCAL_TIME}"

## ROOT DIR
rm -fr ${DEPLOY_DIR} && mkdir -p ${DEPLOY_DIR}

yarn build

cp -fr ./_dist ${DEPLOY_DIR}
cp -fr ./tools ${DEPLOY_DIR}
cp -fr ./package.json ${DEPLOY_DIR}
cp -fr ./serverless/heroku/index.js ${DEPLOY_DIR}

cp -fr ./.next ${DIST_DIR}
cp -fr ./static ${DIST_DIR}

cp -fr ./.env.production ${WWW_DIR}

# DEPLOY DIR
cd ${DEPLOY_DIR}
sed -i '' '/leaa.*0\.0\.1/d' ./package.json
sed -i '' '/build.*tsconfig\.build\.json/d' ./package.json
echo ${DEPLOY_COMMIT} > deploy.txt

#git init
#git remote add heroku https://git.heroku.com/${DEPLOY_HEROKU_APP_NAME}.git
#git add -A
#git commit -m "${DEPLOY_COMMIT}"
#git push -f heroku master
