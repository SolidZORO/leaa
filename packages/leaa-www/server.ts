import express, { Express } from 'express';
import next from 'next';
import cookieParser from 'cookie-parser';

import { cliUtil } from '@leaa/www/src/utils';
import { envConfig } from '@leaa/www/src/configs';
import { authMiddleware } from '@leaa/www/src/middlewares';
import { IRequest, IResponse } from '@leaa/www/src/interfaces';

const dev = process.env.NODE_ENV !== 'production';
const dir = dev ? '.' : './_build/leaa-www';

const app = next({ dev, dir });
const handle: any = app.getRequestHandler();

const { SERVER_PORT } = envConfig;

app.prepare().then(() => {
  const server: Express = express();

  // @ts-ignore
  server.use(cookieParser());
  // server.use(express.static('public'));

  // middleware
  // @ts-ignore
  server.get(/^\/(?!static|login|register|signup|_next)/, authMiddleware);

  // user-agent and static
  server.get('*', (req: IRequest, res: IResponse) => {
    // @ts-ignore
    // eslint-disable-next-line no-underscore-dangle
    global.__SERVER_USER_AGENT__ = req.headers['user-agent'];

    return handle(req, res);
  });

  server.listen(SERVER_PORT);

  cliUtil.envInfo({ dev });
});
