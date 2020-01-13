#! /bin/bash

cd "$(dirname "$0")" || exit

echo "\x1B[93m

 _      ___      ___      __ NOW.SH
| | /| / / | /| / / | /| / /
| |/ |/ /| |/ |/ /| |/ |/ /
|__/|__/ |__/|__/ |__/|__/


\x1B[0m"

CONFIRM_MESSAGE=$(printf "<%s> \n\n🤖 DEPLOY %s? \n\n(Enter/Esc)" "$(pwd)" "")

read -p "${CONFIRM_MESSAGE}" -n 1 -r KEY

MONOREPO_ROOT_DIR="../../"

if [[ $KEY = "" ]]; then
    node ./serverless/now/gen-now-dotenv.js
    cp -fr ./serverless/now/.nowignore ${MONOREPO_ROOT_DIR}
    cd ${MONOREPO_ROOT_DIR} || exit
    pwd
    echo ''
    echo ''
    now -A now-www.json --prod
else
    echo "CANCEL"
fi


