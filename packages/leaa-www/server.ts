import express from 'express';
import next from 'next';
import cookieParser from 'cookie-parser';

import { cliUtil } from '@leaa/www/src/utils';
import { envConfig } from '@leaa/www/src/configs';
import { authMiddleware } from '@leaa/www/src/middlewares';

const dev = process.env.NODE_ENV !== 'production';
const dir = dev ? '.' : './_dist/leaa-www';

const app = next({ dev, dir });
const handle = app.getRequestHandler();

const { PORT } = envConfig;

app.prepare().then(() => {
  const server = express();

  server.use(cookieParser());
  // server.use(express.static('public'));

  // middleware
  server.get(/^\/(?!static|login|register|signup|_next)/, authMiddleware);

  // user-agent and static
  server.get('*', (req, res) => {
    // @ts-ignore
    // eslint-disable-next-line no-underscore-dangle
    global.__SERVER_USER_AGENT__ = req.headers['user-agent'];

    return handle(req, res);
  });

  server.listen(PORT);

  cliUtil.envInfo({ dev });
});
