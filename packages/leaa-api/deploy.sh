#! /bin/bash

unset PLATFORM IGNORE_BUILD

cd "$(dirname "$0")" || exit

__DEPLOY__="./_deploy"


usage() {
  # shellcheck disable=SC2028
  echo "\n🔰 Usage: $0 -p test|ecs|vercel|heroku [-i]  (e.g. sh -p test)\n"
  exit 2
}

set_var() {
  local arg_name=$1
  shift

  if [ -z "${!arg_name}" ]; then
    if echo "$*" | grep -Eq '^test|ecs|vercel|heroku$'; then
        eval "$arg_name=\"$*\""
    else
      usage
    fi

  else
    echo "Error: $arg_name already set"
    usage
  fi
}

platform_vercel() {
  cp -fr ./tools/deploy-config/vercel/* ${__DEPLOY__}
  cd ${__DEPLOY__} || exit

  vercel --prod -c
}

platform_ecs() {
  cd ${__DEPLOY__} || exit

  ls
}

platform_test() {
  cd ${__DEPLOY__} || exit

  yarn start
}

platform_heroku() {
  LOCAL_TIME=$(date "+%Y-%m-%d %H:%M:%S")

  DEPLOY_HEROKU_APP_NAME="test-leaa-api"
  DEPLOY_COMMIT="update AUTO-DEPLOY ${DEPLOY_HEROKU_APP_NAME} @ ${LOCAL_TIME}"

  cd ${__DEPLOY__} || exit
  git init
  git remote add heroku https://git.heroku.com/${DEPLOY_HEROKU_APP_NAME}.git
  git add -A
  git commit -m "${DEPLOY_COMMIT}"
  git push -f heroku master
}


while getopts 'p:i:?h' arg
do
  # shellcheck disable=SC2220
  case $arg in
    p) set_var PLATFORM "$OPTARG" ;;
    i) set_var IGNORE_BUILD yes ;;
    h|?) usage ;;
    *) usage ;; esac
done

echo "\x1B[96m

   ___   ___  ____ ${PLATFORM}
  / _ | / _ \/  _/
 / __ |/ ___// /
/_/ |_/_/  /___/


\x1B[0m"

[ -z "$PLATFORM" ] && usage

CONFIRM_MESSAGE=$(printf "\n\n🤖 \033[1m Start Deploy <%s> ?\033[0m  (Enter/n)" "${PLATFORM}")
read -p "${CONFIRM_MESSAGE}" -n 1 -r KEY


if [[ $KEY = "" ]]; then
  # ---------
  # @ROOT-DIR
  # ---------
  if [[ $IGNORE_BUILD != "yes" ]]; then
    yarn build
  fi

  #/
  if [ ! -d ${__DEPLOY__} ]; then
    mkdir -p ${__DEPLOY__}
  fi
  cp -fr ./_dist/* ${__DEPLOY__}
  cp -f ./tools/deploy-config/ecs/index.js ${__DEPLOY__}
  cp -f ./.env.example ${__DEPLOY__}
  cp -f ./.gitignore ${__DEPLOY__}

  #/assets (copy and then delete some gen files)
  if [ ! -d ${__DEPLOY__}/src/assets ]; then
    mkdir -p ${__DEPLOY__}/src/assets
  fi
  cp -fr ./src/assets/* ${__DEPLOY__}/src/assets

  #delete some gen files
  rm -f ./src/assets/dicts/*.dict.txt
  rm -f ./src/assets/divisions/*.division.json

  #public
  if [ ! -d ${__DEPLOY__}/public ]; then
    mkdir -p ${__DEPLOY__}/public
  fi
  cp -f ./public/robots.txt ${__DEPLOY__}/public
  cp -f ./public/favicon.ico ${__DEPLOY__}/public
  cp -f ./public/get-weixin-code.html ${__DEPLOY__}/public
  cp -f ./public/version.txt ${__DEPLOY__}/public


  # -----------
  # @DEPLOY-DIR
  # -----------
  if [ -n "$PLATFORM" ]; then
    case $PLATFORM in
      test) platform_test ;;
      ecs) platform_test ;;
      vercel) platform_vercel ;;
      heroku) platform_heroku ;;
      *) usage ;; esac
  fi

else
    # shellcheck disable=SC2028
    echo "\nCancel Deploy\n"
fi
