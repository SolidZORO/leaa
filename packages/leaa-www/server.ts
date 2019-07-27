import path from 'path';
import express from 'express';
import envalid from 'envalid';
import next from 'next';
import nextI18NextMiddleware from 'next-i18next/middleware';

import nextI18next from './i18n';

const dev = process.env.NODE_ENV !== 'production';
const rootPath = path.resolve(__dirname, './');
const dotEnvPath = dev ? `${rootPath}/.env` : `${rootPath}/.env.production`;

const { PROTOCOL, PORT, BASE_HOST, NAME } = envalid.cleanEnv(
  process.env,
  { PORT: envalid.num({ devDefault: 3300 }) },
  { dotEnvPath },
);

console.log(NAME, PROTOCOL, BASE_HOST, PORT);

const app = next({
  dev,
  dir: __dirname,
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
