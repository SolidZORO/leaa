import path from 'path';
import envalid from 'envalid';
import { IDotEnvServer } from '@leaa/www/interfaces';

const dev = process.env.NODE_ENV !== 'production';

// `next-dotenv-object.js` cannot be used here, because ts compilation will overwrite it
const rootPath = path.resolve(__dirname);
const dotEnvPath = dev ? `${rootPath}/.env` : `${rootPath}/.env.production`;

// @ts-ignore
export const serverDotenv: IDotEnvServer = envalid.cleanEnv(
  process.env,
  { PORT: envalid.num({ devDefault: 3300 }) },
  { dotEnvPath },
);
