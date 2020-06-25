import { IDotEnv } from '@leaa/dashboard/src/interfaces';

// @ts-ignore
// eslint-disable-next-line no-underscore-dangle
const wENV: IDotEnv = window.__ENV_DATA__;

const dotenv: IDotEnv = {
  ...{
    __ENV__: 'dev',
    //
    SITE_NAME: 'Leaa',
    API_URL: 'PLS_SET_API_URL',
    API_VERSION: 'v1',
    //
    ROUTER_BASENAME: '/',
    PRIMARY_ACCOUNT_TYPE: 'email',
    LOGO_BLACK_FILENAME: 'default-logo-black.svg',
    LOGO_WHITE_FILENAME: 'default-logo-white.svg',
    ANALYTICS_CODE: '',
    //
    DEMO_MODE: false,
    DEBUG_MODE: false,
    SERVER_PROTOCOL: 'http',
    SERVER_PORT: 7007,
    SERVER_HOST: 'localhost',
  },
  ...wENV,
};

export const envConfig: IDotEnv = dotenv;
