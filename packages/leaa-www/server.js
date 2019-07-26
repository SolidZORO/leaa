const express = require('express');
const next = require('next');
const nextI18NextMiddleware = require('next-i18next/middleware').default;
const { setConfig } = require('next/config');

const nextConfig = require('./next.config');
const nextI18next = require('./i18n');

setConfig(nextConfig);

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
