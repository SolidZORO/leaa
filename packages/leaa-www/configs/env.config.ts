// import envalid from 'envalid';
import getConfig from 'next/config';

import { IDotEnvClient } from '@leaa/www/interfaces';
import dotenvObject from '../__next__/next-dotenv-object';

export const envConfig: IDotEnvClient = typeof window === 'undefined' ? dotenvObject : getConfig().publicRuntimeConfig;
