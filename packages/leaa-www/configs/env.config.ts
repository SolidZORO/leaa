import getConfig from 'next/config';
import { IDotEnvClient } from '@leaa/www/interfaces';

const isServer = typeof window === 'undefined';

export const envConfig: IDotEnvClient = isServer ? getConfig().serverRuntimeConfig : getConfig().publicRuntimeConfig;
