import path from 'path';
import express from 'express';
import next from 'next';
import envalid from 'envalid';

const dev = process.env.NODE_ENV !== 'production';

// `next-dotenv-object.js` cannot be used here, because ts compilation will overwrite it
const rootPath = path.resolve(__dirname, './');
const dotEnvPath = dev ? `${rootPath}/.env` : `${rootPath}/.env.production`;
const { PROTOCOL, PORT, BASE_HOST, NAME } = envalid.cleanEnv(
  process.env,
  { PORT: envalid.num({ devDefault: 3300 }) },
  { dotEnvPath },
);

const app = next({ dev });
const handle = app.getRequestHandler();

(async () => {
  await app.prepare();
  const server = express();

  server.use('/static', express.static('static'));
  server.get('*', (req, res) => handle(req, res));

  await server.listen(PORT);

  const url = `${PROTOCOL}://${BASE_HOST}:${PORT}`;
  const urlWithEmoji = `✨✨ \x1b[00;47;9m\x1b[30m${url}\x1b[0m ✨✨`;
  const nodeEnv = `${dev ? '🚀' : '🔰'} ${(process.env.NODE_ENV || 'development').toUpperCase()}`;
  console.log(`\n> ${nodeEnv} / ${NAME} / ${urlWithEmoji}\n`);
})();
