import { envConfig } from '@leaa/www/src/configs';

export const envInfo = ({ dev }: { dev: boolean }): void => {
  const {
    SERVER_PROTOCOL,
    SERVER_PORT,
    SERVER_HOST,
    SITE_NAME,
    DEBUG_MODE,
    DEMO_MODE,
    GRAPHQL_ENDPOINT,
    API_URL,
  } = envConfig;

  // emoji for CLI
  const url = `${SERVER_PROTOCOL}://${SERVER_HOST}:${SERVER_PORT}`;
  const urlWithEmoji = `✨✨ \x1b[00;47;9m\x1b[30m${url}\x1b[0m ✨✨`;
  const nodeEnv = `${dev ? '🚀' : '🔰'} ${(process.env.NODE_ENV || 'development').toUpperCase()}`;

  console.log(`\n\n\n> 🌈 DEBUG ${DEBUG_MODE ? '✅' : '➖'} / DEMO ${DEMO_MODE ? '✅' : '➖'}`);
  console.log(`\n\n> ${nodeEnv} / ${urlWithEmoji}`);

  console.log('\n> 📮 ENVDATA');
  console.log('     - NAME             ', SITE_NAME);
  console.log('     - VERSION          ', `v${process.env.npm_package_version}`);
  console.log('');
  console.log('     - GRAPHQL_ENDPOINT ', GRAPHQL_ENDPOINT);
  console.log('     - API_URL         ', API_URL);
  console.log('\n\n\n');
};

export const cliUtil = {
  envInfo,
};
