## Leaa Dashboard

### Introduction

leaa-dashboard is an Dashboard of leaa, Compiled by Webpack.

### Demo

review [leaa-dashboard](https://leaa-dashboard.now.sh)

### Get Started

Install the latest version via npm or yarn

```shell script
# .env for development
cp _env.js.example _env.development.js

# .env for production
cp _env.js.example _env.js

yarn install
yarn dev
```

### Why is `_env.js` instead of `.env` ?

![_env-design](./docs/images/_env-design.jpg)

### Deploy

#### for Sub Domain

1. yarn build
2. upload server

#### for Sub Directory

1. editor `ROUTER_BASENAME` of `_env.js`, e.g. `ROUTER_BASENAME: '/admin'`
2. yarn build
3. set nginx config

```smartyconfig
server {
    listen 80;
    server_name YOU_DOMAIN.com;

    location / {
        alias /usr/share/nginx/html;
        index  index.html;
    }

    location ^~ /admin {
        alias /usr/share/nginx/html/leaa/packages/leaa-dashboard/_dist;
        index  index.html;
        try_files $uri $uri/ /admin/index.html;

        rewrite ^/admin/_env.js /admin/admin/_env.js last;
        rewrite ^/admin/(scripts|styles|assets)/(.*)$ /admin/admin/$1/$2 last;
    }
}
```
