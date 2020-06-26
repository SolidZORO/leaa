#! /bin/bash

cd "$(dirname "$0")" || exit

__DEPLOY_GIT_BRANCH__="dashboard"

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
  🔰  Usage: $0 -p (local_test | only_build | build_and_push | vercel) [-i] [-S]
      \n
      -p platform
      -i skip yarn build
      -y skip confirm

      -S Setup (init PM2 deploy)
      \n
      e.g. sh $0 -p vercel
  \n\n"
  exit 2
}

set_var() {
  local arg_name=$1
  shift

  echo "Variable: { $arg_name: $* }"

  if [ -z "${!arg_name}" ]; then
    if [ "$arg_name" = "PLATFORM" ]; then
      if echo "$*" | grep -Eq '^local_test|only_build|build_and_push|vercel$'; then
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
  printf "\n📌 __cd_deploy >>> " && pwd && printf "\n"
  cd ${__DEPLOY__} || exit
}

__init_config_file() {
  DEPLOY_DOTENV_FILE="$__DEPLOY__/_env.js"
  if [ -f $DEPLOY_DOTENV_FILE ]; then
    # shellcheck disable=SC2028
    printf "\n👌  Already %s, do NOT Copy :)\n\n" $DEPLOY_DOTENV_FILE
  else
    cp -f ./_env.js $DEPLOY_DOTENV_FILE
  fi

  if [ -f "./ecosystem.config.js" ]; then
    cp -f ./ecosystem.config.js ${__DEPLOY__}
  else
    printf '⚠️  Please rename ecosystem.config.js.example to ecosystem.config.js first \n'
  fi
}

platform_build_and_push() {
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
  GIT_MESSAGE_STR=$(cat <./version.txt | sed 's/["{}]//g' | sed 's/[,]/ /g')
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

  # pm2 step
  if [ "$PM2_SETUP" = "true" ]; then
    pm2 deploy $__DEPLOY_GIT_BRANCH__ setup

    printf '\n\n🚚  PM2 Setup <%s> Completed!\n\n\n' $__DEPLOY_GIT_BRANCH__
  fi

  # pm2 deploy
  pm2 deploy $__DEPLOY_GIT_BRANCH__

  printf "\n\n\n\n✅  PM2 Deploy Completed! <%s>\n\n\n\n" "$GIT_MESSAGE"
}

platform_vercel() {
  cp -fr ./tools/deploy-config/vercel/* ${__DEPLOY__}
  __cd_deploy
  mv robots.example.txt robots.txt

  vercel --prod -c
}

platform_only_build() {
  __cd_deploy

  # shellcheck disable=SC2028
  echo "\n✨  Only Build Done.\n"
}

platform_local_test() {
  cd ${__DEPLOY__} || exit

  serve ./ -s -p 5555

  yarn start
}

# ------------------------------------------------------------------------

while getopts 'p:i?y?S?h' arg; do
  # shellcheck disable=SC2220
  case $arg in
  p) set_var PLATFORM "$OPTARG" ;;
  i) set_var SKIP_BUILD y ;;
  y) set_var SKIP_CONFIRM y ;;
  S) set_var PM2_SETUP true ;;
  h | ?) usage ;;
  *) usage ;; esac
done

echo "\x1B[95m

   ___  ___   ______ _____  ____  ___   ___  ___ ${PLATFORM}
  / _ \/ _ | / __/ // / _ )/ __ \/ _ | / _ \/ _ \\
 / // / __ |_\ \/ _  / _  / /_/ / __ |/ , _/ // /
/____/_/ |_/___/_//_/____/\____/_/ |_/_/|_/____/


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
    # ⚠️ if build, delete all directories first.
    find ./_deploy -type d -maxdepth 1 | grep -v .git | grep -Ev ./_deploy$ | xargs rm -r
    yarn build
  fi

  #/
  if [ ! -d ${__DEPLOY__} ]; then
    mkdir -p ${__DEPLOY__}
  fi
  cp -fr ./_dist/* ${__DEPLOY__}
  cp -f ./tools/deploy-config/server/deploy_repo_gitignore ${__DEPLOY__}/.gitignore



  # -----------
  # @DEPLOY-DIR
  # -----------
  if [ -n "$PLATFORM" ]; then
    case $PLATFORM in
    local_test) platform_local_test ;;
    only_build) platform_only_build ;;
    build_and_push) platform_build_and_push ;;
    vercel) platform_vercel ;;
    *) usage ;; esac
  fi

  ;;
*)
  printf "\nCancel Deploy\n"
  ;;
esac
