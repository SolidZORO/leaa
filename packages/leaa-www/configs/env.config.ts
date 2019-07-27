import envalid from 'envalid';
import getConfig from 'next/config';
import { IDotEnvClient } from '@leaa/www/interfaces';

export const envConfig: IDotEnvClient =
  typeof window === 'undefined' ? envalid.cleanEnv(process.env) : getConfig().publicRuntimeConfig;
