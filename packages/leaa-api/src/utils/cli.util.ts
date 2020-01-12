export const envInfo = ({
  PROTOCOL,
  PORT,
  BASE_HOST,
  NODE_ENV,
  showGraphql,
  publicPath,
  DEMO_MODE,
  DEBUG_MODE,
  DIRNAME,
  VERSION,
}: {
  PROTOCOL: string;
  PORT: number;
  BASE_HOST: string;
  NODE_ENV?: string;
  showGraphql?: boolean;
  publicPath?: string;
  DEMO_MODE?: string | boolean;
  DEBUG_MODE?: string | boolean;
  DIRNAME?: string;
  VERSION?: string;
}) => {
  // emoji for CLI
  const serverBaseByText = `${PROTOCOL}://${BASE_HOST}:${PORT}`;
  const serverBaseByEmoji = `✨✨ \x1b[00;44;9m${serverBaseByText}\x1b[0m ✨✨`;
  const serverGraphqlByEmoji = `✨✨ \x1b[00;41;9m${serverBaseByText}/graphql\x1b[0m ✨✨`;
  const serverEnv = `${NODE_ENV !== 'production' ? '🚀' : '🔰'} ${(NODE_ENV || 'NOT-ENV').toUpperCase()}`;

  console.log(`\n\n> 🌈 DEBUG ${DEBUG_MODE ? '✅' : '➖'} / DEMO ${DEMO_MODE ? '✅' : '➖'}`);

  console.log(`\n\n> ${serverEnv} /     URL`, serverBaseByEmoji);

  if (showGraphql) {
    console.log(`\n> ${serverEnv} / GRAPHQL`, serverGraphqlByEmoji);
  }

  console.log('\n> 📮 ENVDATA');
  console.log('     - VERSION ', `v${VERSION}`);
  console.log('     - DIRNAME ', DIRNAME);
  console.log('     - PUBLIC  ', publicPath);
  console.log('\n\n');
};

export const cliUtil = {
  envInfo,
};
