#! /bin/bash

cd $(dirname "$0")

LOCAL_TIME=`date '+%Y-%m-%d %H:%M:%S'`

DEPLOY_DIR='./_deploy'
DEPLOY_HEROKU_APP_NAME='test-leaa-dashboard'
DEPLOY_COMMIT="update AUTO-DEPLOY ${DEPLOY_HEROKU_APP_NAME} @ ${LOCAL_TIME}"

# ROOT DIR
rm -fr ${DEPLOY_DIR} && mkdir -p ${DEPLOY_DIR}

yarn build

cp -fr ./_dist/* ${DEPLOY_DIR}
cp -fr ./tools/react-express/* ${DEPLOY_DIR}
cp -fr ./public/* ${DEPLOY_DIR}


# DEPLOY DIR
cd ${DEPLOY_DIR}
mv robots.example.txt robots.txt
echo ${DEPLOY_COMMIT} > deploy.txt

git init
git remote add heroku https://git.heroku.com/${DEPLOY_HEROKU_APP_NAME}.git
git add -A
git commit -m "${DEPLOY_COMMIT}"
git push -f heroku master
