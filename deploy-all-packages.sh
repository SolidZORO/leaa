#! /bin/bash

cd "$(dirname "$0")" || exit

__CURRENT_PATH__="$(
  cd "$(dirname "$0")"
  pwd
)" || exit

cd ./packages/leaa-api || exit
sh ./deploy-api.sh -y -p docker_install_and_push

cd $__CURRENT_PATH__ || exit

cd ./packages/leaa-dashboard || exit
sh ./deploy-dashboard.sh -p vercel -y

echo "✅  All Packages Deployment Done!"
