import express from 'express';
import next from 'next';
import nextI18NextMiddleware from 'next-i18next/middleware';

const { setConfig } = require('next/config');

const nextConfig = require('./next.config');
const nextI18next = require('./i18n');

setConfig(nextConfig);

const { PROTOCOL, PORT, BASE_HOST } = process.env;
const dev = process.env.NODE_ENV !== 'production';

const app = next({
  dev,
  dir: __dirname,
  // conf: dev ? undefined : { distDir: './', poweredByHeader: false },
  conf: dev ? undefined : { poweredByHeader: false },
});
const handle = app.getRequestHandler();

(async () => {
  await app.prepare();
  const server = express();

  server.use(nextI18NextMiddleware(nextI18next));
  server.get('*', (req, res) => handle(req, res));

  await server.listen(PORT);
  console.log(`> Ready on ${PROTOCOL}://${BASE_HOST}:${PORT}`); // eslint-disable-line no-console
})();
