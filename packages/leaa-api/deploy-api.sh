#! /bin/bash

cd "$(dirname "$0")" || exit

__DEPLOY__="./_deploy"

unset PLATFORM YARN_BUILD PM2_SETUP

usage() {
  # -p = platform
  # -i = ignore yarn build
  # -S = Setup (pm2)

  # shellcheck disable=SC2028
  echo "\n\n
  🔰  Usage: $0 -p (node_start | docker_start | docker_install | docker_local_test | push_to_repo | docker_install_and_push | vercel) [-i] [-S]
      \n
      -p platform
      -i ignore yarn build
      -S Setup (init PM2 deploy)
      \n
      e.g. sh deploy-api.sh -p docker_install_and_push -S
  \n\n"
  exit 2
}

set_var() {
  local arg_name=$1
  shift

  echo "Variable: { $arg_name: $* }"

  if [ -z "${!arg_name}" ]; then
    if [ "$arg_name" = "PLATFORM" ]; then
      if echo "$*" | grep -Eq '^node_start|docker_start|docker_install|docker_local_test|push_to_repo|docker_install_and_push|vercel'; then
        eval "$arg_name=\"$*\""
      else
        usage
      fi
    fi

    if [ "$arg_name" = "YARN_BUILD" ]; then
      eval "$arg_name=\"$*\""
    fi

    if [ "$arg_name" = "PM2_SETUP" ]; then
      eval "$arg_name=\"$*\""
    fi

    if [ "$arg_name" = "AUTO_CONFIRM" ]; then
      eval "$arg_name=\"$*\""
    fi

  else
    echo "Error: $arg_name already set"
    usage
  fi
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

  cd ${__DEPLOY__} || exit

  cat <./docker-compose.yml |
    sed 's/yarn docker-pm2-test && yarn docker-start/while true;do echo debugging;sleep 5;done/g' >docker-compose-deploy-debug.yml

  # shellcheck disable=SC2016
  # Prevent PORT Conflicts (here use 9119)
  cat <./docker-compose.yml |
    sed 's/${__ENV__}_${DOCKER_NODE_CONTAINER_NAME}/deploy_yarn_install/g' |
    sed 's/${DOCKER_NODE_PORT}/9119/g' |
    sed 's/yarn docker-pm2-test && yarn docker-start/yarn docker-install/g' >docker-compose-deploy-yarn-install.yml

  printf '🚚  Start Dependencies Installation...\n\n'

  docker-compose -f docker-compose-deploy-yarn-install.yml down && docker-compose -f docker-compose-deploy-yarn-install.yml up

  printf '\n\n🎉  All Dependencies Installation Completed!\n\n\n'
}

platform_docker_local_test() {
  platform_docker_install

  printf '\n\n🎏  Show All Containers.\n\n\n'

  docker container ls -a

  printf '\n\n🎏  Up Docker Local Test.\n\n\n'
  docker-compose down && docker-compose up
}

__push_to_deploy_repo() {
  platform_docker_install

  pwd
  GIT_MESSAGE_STR=$(cat <./public/version.txt | sed 's/["{}]//g' | sed 's/[,]/ /g')
  # GIT_MESSAGE_HASH=$(head /dev/urandom | tr -dc A-Z0-9 | head -c 4 ; echo '')
  GIT_MESSAGE_HASH=$(openssl rand -hex 2 | awk '{print toupper($0)}')
  GIT_MESSAGE="$GIT_MESSAGE_STR <$GIT_MESSAGE_HASH>"

  git status
  git add -A
  git commit -m "ci: $GIT_MESSAGE"
  git checkout -b api
  git push -u origin api -f

  printf '\n\n\n📮  Push To Deploy Repo Completed!\n\n\n'
}

platform_docker_install_and_push() {
  __push_to_deploy_repo

  if [ "$PM2_SETUP" = "true" ]; then
    pm2 deploy api setup

    printf '\n\n🚚  PM2 Setup Completed!\n\n\n'
  fi

  pm2 deploy api

  printf "\n\n\n\n✅  PM2 Deploy Completed! <%s>\n\n\n\n" "$GIT_MESSAGE"
}

platform_node_start() {
  cd ${__DEPLOY__} || exit

  yarn start
}

platform_docker_start() {
  cd ${__DEPLOY__} || exit

  yarn docker-start
}

platform_vercel() {
  cp -fr ./tools/deploy-config/vercel/* ${__DEPLOY__}
  cd ${__DEPLOY__} || exit

  vercel --prod -c
}

# ------------------------------------------------------------------------

while getopts 'p:i?S?hy' arg; do
  # shellcheck disable=SC2220
  case $arg in
  p) set_var PLATFORM "$OPTARG" ;;
  i) set_var YARN_BUILD ignore ;;
  y) set_var AUTO_CONFIRM y ;;
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

if [ "$AUTO_CONFIRM" != "y" ]; then
  read -r -p "${CONFIRM_MESSAGE}    [y/N] " AUTO_CONFIRM
fi

case "$AUTO_CONFIRM" in
[yY][eE][sS] | [yY])
  # ---------
  # @ROOT-DIR
  # ---------
  if [ "$YARN_BUILD" != "ignore" ]; then
    yarn build
  fi

  #/
  if [ ! -d ${__DEPLOY__} ]; then
    mkdir -p ${__DEPLOY__}
  fi
  cp -fr ./_dist/* ${__DEPLOY__}
  cp -f ./tools/deploy-config/server/index.js ${__DEPLOY__}
  cp -f ./tools/deploy-config/server/deploy_repo_gitignore ${__DEPLOY__}/.gitignore
  cp -f ./tools/deploy-config/server/deploy_repo_package.json ${__DEPLOY__}/package.json

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
    node_start) platform_node_start ;;
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
