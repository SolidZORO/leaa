import express from 'express';
import next from 'next';
import cookieParser from 'cookie-parser';

// import { serverDotenv } from '@leaa/www/server-dotenv';
import serverDotenv from '@leaa/www/configs/next-dotenv-object';
import { authMiddleware } from '@leaa/www/middlewares';

// import pathToRegexp from 'path-to-regexp';

const dev = process.env.NODE_ENV !== 'production';

const { PROTOCOL, PORT, BASE_HOST, NAME } = serverDotenv;

const app = next({ dev, dir: dev ? '.' : './_dist' });
const handle = app.getRequestHandler();

(async () => {
  await app.prepare();
  const server = express();

  server.use(cookieParser());
  server.use('/static', express.static('static'));
  server.get(/^\/(?!static|login|register|_next)/, authMiddleware);
  server.get('*', (req, res) => handle(req, res));

  await server.listen(PORT);

  const url = `${PROTOCOL}://${BASE_HOST}:${PORT}`;
  const urlWithEmoji = `✨✨ \x1b[00;47;9m\x1b[30m${url}\x1b[0m ✨✨`;
  const nodeEnv = `${dev ? '🚀' : '🔰'} ${(process.env.NODE_ENV || 'development').toUpperCase()}`;
  console.log(`\n> ${nodeEnv} / ${NAME} / ${urlWithEmoji}\n`);
})();
