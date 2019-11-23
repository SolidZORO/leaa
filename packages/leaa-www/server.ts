import express from 'express';
import next from 'next';
import cookieParser from 'cookie-parser';

import { envConfig } from '@leaa/www/src/configs';
import { authMiddleware } from '@leaa/www/src/middlewares';

const dev = process.env.NODE_ENV !== 'production';

const app = next({ dev, dir: dev ? './' : './_dist/leaa-www' });
const handle = app.getRequestHandler();

(async () => {
  const { PROTOCOL, PORT, BASE_HOST, NAME } = envConfig;

  await app.prepare();
  const server = express();

  server.use(cookieParser());
  // server.use('/static', express.static('static'));
  server.get(/^\/(?!static|login|register|signup|_next)/, authMiddleware);

  server.get('*', (req, res) => {
    // @ts-ignore
    // eslint-disable-next-line no-underscore-dangle
    global.__SERVER_USER_AGENT__ = req.headers['user-agent'];

    return handle(req, res);
  });

  await server.listen(PORT);

  const url = `${PROTOCOL}://${BASE_HOST}:${PORT}`;
  const urlWithEmoji = `✨✨ \x1b[00;47;9m\x1b[30m${url}\x1b[0m ✨✨`;
  const nodeEnv = `${dev ? '🚀' : '🔰'} ${(process.env.NODE_ENV || 'development').toUpperCase()}`;

  console.log(`\n> ${nodeEnv} / ${NAME} / ${urlWithEmoji}\n`);
})();
