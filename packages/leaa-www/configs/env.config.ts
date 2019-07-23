import getConfig from 'next/config';
import { IDotEnvClient, IDotEnvServer } from '@leaa/www/interfaces';

const {
  publicRuntimeConfig,
  serverRuntimeConfig,
}: {
  publicRuntimeConfig: IDotEnvClient;
  serverRuntimeConfig: IDotEnvServer;
} = getConfig();

export { publicRuntimeConfig, serverRuntimeConfig };
