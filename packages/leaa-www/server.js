// import express from 'express';
// import next from 'next';
// import nextI18NextMiddleware from 'next-i18next/middleware';
//
// import nextI18next from './i18n';
// import { publicRuntimeConfig } from './configs/env.config';
//
// const { PROTOCOL, PORT, BASE_HOST } = publicRuntimeConfig;
//
// // const port = process.env.PORT || 3000;
// const app = next({ dev: process.env.NODE_ENV !== 'production' });
// const handle = app.getRequestHandler();
//
// (async () => {
//   await app.prepare();
//   const server = express();
//
//   server.use(nextI18NextMiddleware(nextI18next));
//
//   server.get('*', (req, res) => handle(req, res));
//
//   await server.listen(PORT);
//
//   console.log(`> Ready on ${PROTOCOL}://${BASE_HOST}:${PORT}`); // eslint-disable-line no-console
// })();

const express = require('express');
const next = require('next');
const nextI18NextMiddleware = require('next-i18next/middleware').default;

const nextI18next = require('./i18n');

const { PROTOCOL, PORT, BASE_HOST } = process.env;
// const port = process.env.PORT || 3000;
const app = next({ dev: process.env.NODE_ENV !== 'production' });
const handle = app.getRequestHandler();

(async () => {
  await app.prepare();
  const server = express();

  server.use(nextI18NextMiddleware(nextI18next));

  server.get('*', (req, res) => handle(req, res));

  await server.listen(PORT);
  console.log(`> Ready on ${PROTOCOL}://${BASE_HOST}:${PORT}`); // eslint-disable-line no-console
})();
