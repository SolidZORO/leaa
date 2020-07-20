#! /bin/bash

cd "$(dirname "$0")" || exit

__DEPLOY_GIT_BRANCH__="api"

__ABS_PATH__="$(
  cd "$(dirname "$0")"
  pwd
)" || exit
__DEPLOY__="$__ABS_PATH__/_deploy"

unset PLATFORM SKIP_BUILD SKIP_CONFIRM PM2_SETUP

usage() {
  # -p = platform
  # -i = ignore yarn build
  # -S = Setup (pm2)

  # shellcheck disable=SC2028
  echo "\n\n
  🔰  Usage: $0 -p (node_start | docker_start | docker_install | docker_local_test | push_to_repo | docker_install_and_push | update_config_and_push | vercel) [-i] [-S]
      \n
      -p platform
      -i skip yarn build
      -y skip confirm

      -S Setup (init PM2 deploy)
      \n
      e.g. sh $0 -p docker_install_and_push
  \n\n"
  exit 2
}

set_var() {
  local arg_name=$1
  shift

  echo "Variable: { $arg_name: $* }"

  if [ -z "${!arg_name}" ]; then
    if [ "$arg_name" = "PLATFORM" ]; then
      if echo "$*" | grep -Eq '^node_start|docker_start|docker_install|docker_local_test|push_to_repo|update_config_and_push|docker_install_and_push|vercel'; then
        eval "$arg_name=\"$*\""
      else
        usage
      fi
    fi

    if [ "$arg_name" = "SKIP_BUILD" ]; then
      eval "$arg_name=\"$*\""
    fi

    if [ "$arg_name" = "SKIP_CONFIRM" ]; then
      eval "$arg_name=\"$*\""
    fi

    if [ "$arg_name" = "PM2_SETUP" ]; then
      eval "$arg_name=\"$*\""
    fi

  else
    echo "Error: $arg_name already set"
    usage
  fi
}

__cd_deploy() {
  printf "\n"
  printf "📌 __pwd       >>> " && pwd
  cd ${__DEPLOY__} || exit
  printf "📌 __cd_deploy >>> " && pwd && printf "\n"
}

__init_config_file() {
  DEPLOY_DOTENV_FILE="$__DEPLOY__/.env"
  if [ -f $DEPLOY_DOTENV_FILE ]; then
    # shellcheck disable=SC2028
    printf "\n👌  Already %s, do NOT Copy :)\n\n" $DEPLOY_DOTENV_FILE
  else
    cp -f ./.env $DEPLOY_DOTENV_FILE
  fi

  if [ -f "./ecosystem.config.js" ]; then
    cp -f ./ecosystem.config.js ${__DEPLOY__}
  else
    printf '⚠️  Please rename ecosystem.config.js.example to ecosystem.config.js first \n'
  fi

  cp -f ./docker-compose.yml ${__DEPLOY__}
}

platform_docker_install() {
  __init_config_file
  __cd_deploy

  # for debug
  cat <./docker-compose.yml |
    sed 's/yarn docker-pm2-test && yarn docker-start/while true;do echo debugging;sleep 5;done/g' >docker-compose-deploy-debug.yml

  # for install, prevent PORT conflicts (here use 9119)
  # shellcheck disable=SC2016
  cat <./docker-compose.yml |
    sed 's/${__ENV__}_${DOCKER_NODE_CONTAINER_NAME}/deploy_yarn_install/g' |
    sed 's/node:14-alpine/registry.cn-hangzhou.aliyuncs.com\/solidzoro\/node:14-alpine-gyp-sdk/g' |
    sed 's/${DOCKER_NODE_PORT}/9119/g' |
    sed 's/yarn docker-pm2-test && yarn docker-start/yarn docker-install/g' >docker-compose-deploy-yarn-install.yml

  printf '🚚  Start Dependencies Installation...\n\n'

  docker-compose -f docker-compose-deploy-yarn-install.yml down && docker-compose -f docker-compose-deploy-yarn-install.yml up

  printf '\n\n🎉  All Dependencies Installation Completed!\n\n\n'
}

platform_docker_local_test() {
  __cd_deploy
  platform_docker_install
  docker-compose -f docker-compose-deploy-yarn-install.yml down

  printf '\n\n🎏  Show All Containers.\n\n\n'

  docker container ls -a

  printf '\n\n🎏  Up Docker Local Test.\n\n\n'
  docker-compose down && docker-compose up
}

# just for edit config and push (debug)
platform_update_config_and_push() {
  __cd_deploy

  # find git origin repo
  GIT_REMOTE_ORIGIN=$(cat <ecosystem.config.js | grep -E -o 'git@.*\.git')
  if [ -z "$GIT_REMOTE_ORIGIN" ]; then
    printf '⚠️  Please check ecosystem.config.js repo first \n'
    exit 2
  fi

  # set git origin repo
  GIT_CURRENT_ORIGIN=$(git remote -v)
  if [ -z "$GIT_CURRENT_ORIGIN" ]; then
    git remote add origin $GIT_REMOTE_ORIGIN
    git remote -v
  fi

  # check git branch and init
  GIT_CURRENT_BRANCH=$(git symbolic-ref --short HEAD)
  if [ "$GIT_CURRENT_BRANCH" != "$__DEPLOY_GIT_BRANCH__" ]; then
    printf "⚠️️ '/_deploy' directory is not an independent Git Repo"

    git init
    git checkout -b $__DEPLOY_GIT_BRANCH__

    printf '\n\n🚚  _deploy Git Repo Branch <%s> Create Completed!\n\n\n' $__DEPLOY_GIT_BRANCH__
  fi

  # git push
  GIT_MESSAGE_STR=$(cat <./public/version.txt | sed 's/["{}]//g' | sed 's/[,]/ /g')
  # GIT_MESSAGE_HASH=$(head /dev/urandom | tr -dc A-Z0-9 | head -c 4 ; echo '')
  GIT_MESSAGE_HASH=$(openssl rand -hex 2 | awk '{print toupper($0)}')
  GIT_MESSAGE="ci: $GIT_MESSAGE_STR <$GIT_MESSAGE_HASH>"

  # shellcheck disable=SC2028
  echo "✏️  GIT_MESSAGE <$__DEPLOY_GIT_BRANCH__> >>> $GIT_MESSAGE \n"

  git status
  git add -A
  git commit -m "$GIT_MESSAGE"
  git checkout -b $__DEPLOY_GIT_BRANCH__
  git push -u origin $__DEPLOY_GIT_BRANCH__ -f

  printf "\n\n\n📮  Git Push To Deploy Repo <%s> Completed!\n\n\n" $__DEPLOY_GIT_BRANCH__
}

platform_docker_install_and_push() {
  if [ "$SKIP_BUILD" != "y" ]; then
    platform_docker_install
  fi

  platform_update_config_and_push

  # pm2 step
  if [ "$PM2_SETUP" = "true" ]; then
    pm2 deploy $__DEPLOY_GIT_BRANCH__ setup

    printf '\n\n🚚  PM2 Setup <%s> Completed!\n\n\n' $__DEPLOY_GIT_BRANCH__
  fi

  # pm2 deploy
  pm2 deploy $__DEPLOY_GIT_BRANCH__

  printf "\n\n\n\n✅  PM2 Deploy Completed! <%s>\n\n\n\n" "$GIT_MESSAGE"
}

platform_node_start() {
  __cd_deploy

  yarn start
}

platform_docker_start() {
  __cd_deploy

  yarn docker-start
}

platform_vercel() {
  cp -fr ./tools/deploy-config/vercel/* ${__DEPLOY__}
  __cd_deploy

  vercel --prod -c
}

# ------------------------------------------------------------------------

while getopts 'p:i?S?hy' arg; do
  # shellcheck disable=SC2220
  case $arg in
  p) set_var PLATFORM "$OPTARG" ;;
  i) set_var SKIP_BUILD y ;;
  y) set_var SKIP_CONFIRM y ;;
  S) set_var PM2_SETUP true ;;
  h | ?) usage ;;
  *) usage ;; esac
done

echo "\x1B[96m

   ___   ___  ____ <${PLATFORM}>
  / _ | / _ \/  _/
 / __ |/ ___// /
/_/ |_/_/  /___/


\x1B[0m"

[ -z "$PLATFORM" ] && usage

CONFIRM_MESSAGE=$(printf "\n\n🔰 \033[1m Start Deploy   👉 <%s> ?\033[0m" "${PLATFORM}")

if [ "$SKIP_CONFIRM" != "y" ]; then
  read -r -p "${CONFIRM_MESSAGE}    [y/N] " SKIP_CONFIRM
fi

case "$SKIP_CONFIRM" in
[yY][eE][sS] | [yY])
  # ---------
  # @ROOT-DIR
  # ---------
  if [ "$SKIP_BUILD" != "y" ]; then
    if [ "$PLATFORM" != "update_config_and_push" ]; then
      yarn build
    fi
  fi

  #/
  if [ ! -d ${__DEPLOY__} ]; then
    mkdir -p ${__DEPLOY__}
  fi
  cp -fr ./_dist/* ${__DEPLOY__}
  cp -f ./tools/deploy-config/server/index.js ${__DEPLOY__}
  cp -f ./tools/deploy-config/server/deploy_repo_gitignore ${__DEPLOY__}/.gitignore
  cp -f ./tools/deploy-config/server/deploy_repo_package.json ${__DEPLOY__}/package.json

  # dicts
  if [ ! -d ${__DEPLOY__}/resources/dicts ]; then mkdir -p ${__DEPLOY__}/resources/dicts; fi
  cp -fr ./resources/dicts/.gitignore ${__DEPLOY__}/resources/dicts

  # fonts
  if [ ! -d ${__DEPLOY__}/resources/fonts ]; then mkdir -p ${__DEPLOY__}/resources/fonts; fi
  cp -fr ./resources/fonts/halva.otf ${__DEPLOY__}/resources/fonts

  # divisions
  if [ ! -d ${__DEPLOY__}/resources/divisions ]; then mkdir -p ${__DEPLOY__}/resources/divisions; fi
  cp -fr ./resources/divisions/source ${__DEPLOY__}/resources/divisions

  # public
  if [ ! -d ${__DEPLOY__}/public ]; then mkdir -p ${__DEPLOY__}/public; fi
  cp -f ./public/robots.txt ${__DEPLOY__}/public
  cp -f ./public/favicon.ico ${__DEPLOY__}/public
  cp -f ./public/get-weixin-code.html ${__DEPLOY__}/public
  cp -f ./public/version.txt ${__DEPLOY__}/public

  # -----------
  # @DEPLOY-DIR
  # -----------
  if [ -n "$PLATFORM" ]; then
    case $PLATFORM in
    node_start) platform_node_start ;;
    update_config_and_push) platform_update_config_and_push ;;
    docker_start) platform_docker_start ;;
    docker_local_test) platform_docker_local_test ;;
    docker_install) platform_docker_install ;;
    docker_install_and_push) platform_docker_install_and_push ;;
    vercel) platform_vercel ;;
    *) usage ;; esac
  fi

  ;;
*)
  printf "\nCancel Deploy\n"
  ;;
esac
