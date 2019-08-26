import getConfig from 'next/config';
import { IDotEnvClient } from '@leaa/www/interfaces';

export const envConfig: IDotEnvClient = typeof window === 'undefined' ? process.env : getConfig().publicRuntimeConfig;
