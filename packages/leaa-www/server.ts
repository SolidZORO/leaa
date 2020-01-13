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
  server.use(express.static('public'));

  // middleware
  server.get(/^\/(?!static|login|register|signup|_next)/, authMiddleware);

  // routes
  server.get('/', (req, res) => app.render(req, res, '/Home/Home'));
  server.get('/login', (req, res) => app.render(req, res, '/Auth/Login/Login'));
  server.get('/signup', (req, res) => app.render(req, res, '/Auth/Signup/Signup'));
  server.get('/logout', (req, res) => app.render(req, res, '/Auth/Logout/Logout'));
  server.get('/forget', (req, res) => app.render(req, res, '/Auth/Forget/Forget'));
  //
  server.get('/account', (req, res) => app.render(req, res, '/Account/Account'));
  //
  server.get('/hello', (req, res) => app.render(req, res, '/Hello/HelloList/HelloList'));
  server.get('/hello/:name', (req, res) => app.render(req, res, '/Hello/HelloName/HelloName', { ...req.params }));
  //
  server.get('/article', (req, res) => app.render(req, res, '/Article/ArticleList/ArticleList'));
  server.get('/article/:slug', (req, res) =>
    app.render(req, res, '/Article/ArticleItem/ArticleItem', { ...req.params }),
  );

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

// await app.prepare();
// const server = express();
//
// server.use(cookieParser());
// server.use(express.static('public'));
//
// // middleware
// server.get(/^\/(?!static|login|register|signup|_next)/, authMiddleware);
//
// // routes
// server.get('/', (req, res) => app.render(req, res, '/Home/Home'));
// server.get('/login', (req, res) => app.render(req, res, '/Auth/Login/Login'));
// server.get('/signup', (req, res) => app.render(req, res, '/Auth/Signup/Signup'));
// server.get('/logout', (req, res) => app.render(req, res, '/Auth/Logout/Logout'));
// server.get('/forget', (req, res) => app.render(req, res, '/Auth/Forget/Forget'));
// //
// server.get('/account', (req, res) => app.render(req, res, '/Account/Account'));
// //
// server.get('/hello', (req, res) => app.render(req, res, '/Hello/HelloList/HelloList'));
// server.get('/hello/:name', (req, res) => app.render(req, res, '/Hello/HelloName/HelloName', { ...req.params }));
// //
// server.get('/article', (req, res) => app.render(req, res, '/Article/ArticleList/ArticleList'));
// server.get('/article/:slug', (req, res) =>
//   app.render(req, res, '/Article/ArticleItem/ArticleItem', { ...req.params }),
// );
//
// // user-agent and static
// server.get('*', (req, res) => {
//   // @ts-ignore
//   // eslint-disable-next-line no-underscore-dangle
//   global.__SERVER_USER_AGENT__ = req.headers['user-agent'];
//
//   return handle(req, res);
// });
//
// await server.listen(PORT);
//
// cliUtil.envInfo({ dev });
// (async () => {
// })();
