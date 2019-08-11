import express from 'express';
import next from 'next';
import cookieParser from 'cookie-parser';

import { serverDotenv } from '@leaa/www/server-devenv';
import { authMiddleware } from '@leaa/www/middlewares';

const dev = process.env.NODE_ENV !== 'production';

const { PROTOCOL, PORT, BASE_HOST, NAME } = serverDotenv;

const app = next({ dev, dir: dev ? '.' : './_dist/leaa-www' });
// const app = next({ dev });
const handle = app.getRequestHandler();

(async () => {
  await app.prepare();
  const server = express();

  server.use(cookieParser());
  server.use('/static', express.static('static'));
  server.get(/^\/(?!static|login|register|_next)/, authMiddleware);

  const plainFileOptions = { root: __dirname + '/static/', headers: { 'Content-Type': 'text/plain;charset=UTF-8' } };
  const iconFileOptions = { root: __dirname + '/static/favicons' };
  // const xmlFileOptions = { root: __dirname + '/static/', headers: { 'Content-Type': 'text/xml;charset=UTF-8' } };

  server.get('/robots.txt', (req, res) => res.status(200).sendFile('robots.txt', plainFileOptions));
  server.get('/deploy.txt', (req, res) => res.status(200).sendFile('deploy.txt', plainFileOptions));
  server.get('/favicon.ico', (req, res) => res.status(200).sendFile('favicon.ico', iconFileOptions));
  // server.get('/sitemap.xml', (req, res) => res.status(200).sendFile('sitemap.xml', xmlFileOptions));

  server.get('*', (req, res) => handle(req, res));

  await server.listen(PORT);

  const url = `${PROTOCOL}://${BASE_HOST}:${PORT}`;
  const urlWithEmoji = `✨✨ \x1b[00;47;9m\x1b[30m${url}\x1b[0m ✨✨`;
  const nodeEnv = `${dev ? '🚀' : '🔰'} ${(process.env.NODE_ENV || 'development').toUpperCase()}`;
  console.log(`\n> ${nodeEnv} / ${NAME} / ${urlWithEmoji}\n`);
})();
