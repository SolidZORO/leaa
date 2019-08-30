# Leaa Api

## **ABOUT**

leaa-api base [Nest.js](https://github.com/nestjs/nest) framework.

## **INSTALLATION**

```
docker-compose down && docker-compose up -d

# .env for development
cp .env.example .env

# .env for production
cp .env.example .env.production # for production

yarn install
yarn dev
```

## **TIPS**

if your `Node.js` version <= `10.15.3`, you can run `yarn dev`, otherwise, your should run `dev-nodemon`.
because `dev-tsnodedev` does not support `Node.js` > `10.15.3` on `Nest.js` HMR.
