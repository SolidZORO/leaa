# NODE DEVELOPMENT IMAGE (size ~ 380MB)
#
# this image JUST for deploy `yarn installnot`, NOT for production!
#
# Why do you need to build? Because `yarn add` some packages NEED node-gyp, `node:14-alpine` not have these dev-tools.
# I will build and push to 2 docker registry (github registry is too slow in China).
#
# docker pull registry.cn-hangzhou.aliyuncs.com/solidzoro/node:14-alpine-gyp-sdk
# docker pull docker.pkg.github.com/solidzoro/leaa/node:14-alpine-gyp-sdk
#
# docker build usage: `docker build -t node:14-alpine-gyp-sdk .`
FROM node:14-alpine

ENV YARN_REGISTRY https://registry.npm.taobao.org
ENV YARN_DISTURL https://npm.taobao.org/dist
ENV BUILD_DEPS \
  python \
  alpine-sdk
  # make gcc g++

RUN echo "---- 🔰 ---- " \
  && echo -e "http://mirrors.aliyun.com/alpine/v3.11/main/\nhttp://mirrors.aliyun.com/alpine/v3.11/community/" > /etc/apk/repositories \
  #
  && apk add --no-cache --virtual .build-deps $BUILD_DEPS \
  #
  && echo "" \
  && echo "CONFIG NPM" \
  && echo "" \
  && npm config get registry \
  && yarn config get disturl \
  && npm config set -g registry ${YARN_REGISTRY} \
  && npm config set -g disturl ${YARN_DISTURL} \
  && npm config set registry ${YARN_REGISTRY} \
  && npm config set disturl ${YARN_DISTURL} \
  && npm config get registry \
  && yarn config get disturl \
  #
  && echo "" \
  && echo "CONFIG YARN" \
  && echo "" \
  && yarn config get registry \
  && yarn config get disturl \
  && yarn config set --global registry ${YARN_REGISTRY} \
  && yarn config set --global disturl ${YARN_DISTURL} \
  && yarn config set registry ${YARN_REGISTRY} \
  && yarn config set disturl ${YARN_DISTURL} \
  && yarn config get registry \
  && yarn config get disturl \
  #
  && npm install -g pm2 \
  #
  && npm cache verify \
  && yarn cache clean \
  # && apk del .build-deps \
  && rm -rf /var/cache/apk/* \
  && echo "" \
  && echo "---- ✅ ---- " \
  && echo "pm2 $(pm2 --version)" \
  && echo "node $(node -v)" \
  && echo "npm $(npm -v)" \
  && echo "yarn $(yarn -v)" \
  && echo "$(python --version)" \
  && echo "" \
  && echo "---- ⛱ ---- " \
  && ls -la ~ \
  && echo "" \
  && echo ""

ENTRYPOINT ["docker-entrypoint.sh"]

CMD [ "node" ]
