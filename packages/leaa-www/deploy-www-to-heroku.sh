#! /bin/bash

cd $(dirname "$0")

LOCAL_TIME=`date '+%Y-%m-%d %H:%M:%S'`

DEPLOY_DIR='./_deploy'
DEPLOY_HEROKU_APP_NAME='test-leaa-www'
DEPLOY_COMMIT="update AUTO-DEPLOY ${DEPLOY_HEROKU_APP_NAME} @ ${LOCAL_TIME}"

## ROOT DIR
rm -fr ${DEPLOY_DIR} && mkdir -p ${DEPLOY_DIR}

yarn build

cp -fr ./.next ${DEPLOY_DIR}
cp -fr ./static ${DEPLOY_DIR}
cp -fr ./server.js ${DEPLOY_DIR}
cp -fr ./.env.production ${DEPLOY_DIR}
cp -fr ./next.config.js ${DEPLOY_DIR}
cp -fr ./package.json ${DEPLOY_DIR}

mkdir -p ${DEPLOY_DIR}/styles
cp -fr ./styles/variables.less ${DEPLOY_DIR}/styles

mkdir -p ${DEPLOY_DIR}/configs
cp -fr ./configs/next-*.js ${DEPLOY_DIR}/configs


# DEPLOY DIR
cd ${DEPLOY_DIR}
sed -i '' '/leaa.*0\.0\.1/d' ./package.json
sed -i '' '/build.*tsconfig\.build\.json/d' ./package.json
echo ${DEPLOY_COMMIT} > deploy.txt

git init
git remote add heroku https://git.heroku.com/${DEPLOY_HEROKU_APP_NAME}.git
git add -A
git commit -m "${DEPLOY_COMMIT}"
git push -f heroku master
