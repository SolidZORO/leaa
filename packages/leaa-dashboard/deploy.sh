#! /bin/bash

unset PLATFORM YARN_BUILD

cd "$(dirname "$0")" || exit

__DEPLOY__="./_deploy"


usage() {
  # shellcheck disable=SC2028
  echo "\n\n\n\n🔰  Usage: $0 -p test|ecs|vercel [-i]  (e.g. sh -p test)\n\n\n\n"
  exit 2
}

set_var() {
  local arg_name=$1
  shift

  # shellcheck disable=SC2028
  echo "VAR { $arg_name: $* }"

  if [ -z "${!arg_name}" ]; then
    if [ "$arg_name" = "PLATFORM" ]; then
      if echo "$*" | grep -Eq '^test|ecs|vercel$'; then
        eval "$arg_name=\"$*\""
      else
        usage
      fi
    fi

    if [ "$arg_name" = "YARN_BUILD" ]; then
        eval "$arg_name=\"$*\""
    fi

  else
    echo "Error: $arg_name already set"
    usage
  fi
}

platform_vercel() {
  cp -fr ./tools/deploy-config/vercel/* ${__DEPLOY__}
  cd ${__DEPLOY__} || exit
  mv robots.example.txt robots.txt

  vercel --prod -c
}

platform_ecs() {
  cd ${__DEPLOY__} || exit

  # shellcheck disable=SC2028
  echo "\n✨  Done Platform ECS\n"
}

platform_test() {
  cd ${__DEPLOY__} || exit

  serve ./ -s -p 5555

  yarn start
}


# ------------------------------------------------------------------------

while getopts 'p:i?h' arg
do
  # shellcheck disable=SC2220
  case $arg in
    p) set_var PLATFORM "$OPTARG" ;;
    i) set_var YARN_BUILD ignore ;;
    h|?) usage ;;
    *) usage ;; esac
done

echo "\x1B[95m

   ___  ___   ______ _____  ____  ___   ___  ___ ${PLATFORM}
  / _ \/ _ | / __/ // / _ )/ __ \/ _ | / _ \/ _ \\
 / // / __ |_\ \/ _  / _  / /_/ / __ |/ , _/ // /
/____/_/ |_/___/_//_/____/\____/_/ |_/_/|_/____/


\x1B[0m"


[ -z "$PLATFORM" ] && usage

CONFIRM_MESSAGE=$(printf "\n\n🤖 \033[1m Start Deploy <%s> ?\033[0m  (Enter/n)" "${PLATFORM}")
read -p "${CONFIRM_MESSAGE}" -n 1 -r KEY


if [ "$KEY" = "" ]; then
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
  cp -fr ./public/* ${__DEPLOY__}

  # -----------
  # @DEPLOY-DIR
  # -----------
  if [ -n "$PLATFORM" ]; then
    case $PLATFORM in
      test) platform_test ;;
      ecs) platform_ecs ;;
      vercel) platform_vercel ;;
      *) usage ;; esac
  fi

else
    # shellcheck disable=SC2028
    echo "\nCancel Deploy\n"
fi
