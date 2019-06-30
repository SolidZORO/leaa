#! /bin/bash

# https://github.com/idesis-gmbh/png2icons
# npm install png2icons -g

cd $(dirname "$0")
png2icons favicon_144.png favicon -icop -bc -i
cp ./favicon.ico ../../../../public
