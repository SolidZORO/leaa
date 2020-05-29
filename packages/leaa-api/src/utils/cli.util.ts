import { IDotEnv } from '@leaa/api/src/interfaces';

import pkg from '@leaa/api/package.json';

export const envInfoForCli = ({
  config,
  NODE_ENV,
  PUBLIC_PATH,
  DIRNAME,
}: {
  config: IDotEnv | any;
  NODE_ENV?: string;
  PUBLIC_PATH?: string;
  DIRNAME?: string;
}) => {
  // emoji for CLI
  const serverBaseByText = `${config.SERVER_PROTOCOL}://${config.BASE_HOST}:${config.SERVER_PORT}`;
  const serverBaseByEmoji = `✨✨ \x1b[00;44;9m${serverBaseByText}\x1b[0m ✨✨`;
  const serverEnv = `${NODE_ENV !== 'production' ? '🚀' : '🔰'} ${(NODE_ENV || 'NOT-ENV').toUpperCase()}`;

  console.log(`\n\n> 🌈 DEBUG ${config.DEBUG_MODE ? '✅' : '➖'} / DEMO ${config.DEMO_MODE ? '✅' : '➖'}`);

  console.log(`\n\n> ${serverEnv} /     URL`, serverBaseByEmoji);

  console.log('\n> 📮 ENVDATA');
  console.log('     - VERSION ', `v${pkg.version}`);
  console.log('     - DIRNAME ', DIRNAME);
  console.log('     - PUBLIC  ', PUBLIC_PATH);
  console.log('\n\n');
};
