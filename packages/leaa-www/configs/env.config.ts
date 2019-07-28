// import getConfig from 'next/config';
// import { IDotEnvClient } from '@leaa/www/interfaces';
//
// export const envConfig: IDotEnvClient =
//   typeof window === 'undefined' ? getConfig().publicRuntimeConfig : getConfig().publicRuntimeConfig;

import getConfig from 'next/config';

import { IDotEnvClient } from '@leaa/www/interfaces';

export const envConfig: any = typeof window === 'undefined' ? process.env : {};
