#! /bin/bash

cd "$(dirname "$0")" || exit

sh deploy-build.sh 'HEROKU' && sh deploy-heroku.sh
#sh deploy-build.sh 'NOW.SH' && sh deploy-now.sh
