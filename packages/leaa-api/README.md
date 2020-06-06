# Leaa Api

## **ABOUT**

leaa-api base [Nest.js](https://github.com/nestjs/nest) framework.

## **INSTALLATION**

```shell script
# .env for development
cp .env.example .env

# .env for production
cp .env.example .env.production

# run mysql with docker-compose
docker-compose down && docker-compose up -d

# init
yarn insatll && yarn seed --nuke

# dev
yarn dev
```

## **DEPLOY**

more step see `deploy-local-test.sh`

## **TIPS**

starting from `v1.0.4`, the api also supports `i18n`.

the currently available languages are 🇺🇸 English (en-US) and 🇨🇳 Chinese (zh-CN). The default is English.

to request Chinese, please set req.header.lang, e.g. `req.heard.lang = 'zh-CN'`

more config @see `leaa-api/src/modules/i18n/i18n.service.ts`
