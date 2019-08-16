#! /bin/bash

# https://github.com/idesis-gmbh/png2icons
# npm install png2icons -g

# https://convertio.co/svg-ico/

cd "$(dirname "$0")" || exit
png2icons favicon_144.png favicon -icop -bc -i
cp ./favicon.ico ../../../../public
