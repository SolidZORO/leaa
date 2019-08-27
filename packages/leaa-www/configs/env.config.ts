import getConfig from 'next/config';
import { IDotEnvClient } from '@leaa/www/interfaces';

const isServer = typeof window === 'undefined';

let env: IDotEnvClient;

if (isServer) {
  // eslint-disable-next-line global-require
  env = require('./next-dotenv-object');
} else {
  env = getConfig().publicRuntimeConfig;
}

export const envConfig: IDotEnvClient = env;
