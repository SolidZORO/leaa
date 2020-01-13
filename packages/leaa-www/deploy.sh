#! /bin/bash

cd "$(dirname "$0")" || exit


# install `npm i -g now@16.2` support deploy .env file
sh deploy-now.sh
