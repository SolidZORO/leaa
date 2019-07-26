import getConfig from 'next/config';
import { IDotEnvClient } from '@leaa/www/interfaces';

// @ts-ignore
export const envConfig: IDotEnvClient = typeof window === 'undefined' ? process.env : getConfig().publicRuntimeConfig;
