export const emoji = ({
  PROTOCOL,
  PORT,
  BASE_HOST,
  NODE_ENV,
  showGraphql,
}: {
  PROTOCOL: string;
  PORT: number;
  BASE_HOST: string;
  NODE_ENV?: string;
  showGraphql?: boolean;
}) => {
  // emoji for CLI
  const serverBaseByText = `${PROTOCOL}://${BASE_HOST}:${PORT}`;
  const serverBaseByEmoji = `✨✨ \x1b[00;44;9m${serverBaseByText}\x1b[0m ✨✨`;
  const serverGraphqlByEmoji = `✨✨ \x1b[00;41;9m${serverBaseByText}/graphql\x1b[0m ✨✨`;
  const serverEnv = `${NODE_ENV !== 'production' ? '🚀' : '🔰'} ${(NODE_ENV || 'NOT-ENV').toUpperCase()}`;

  console.log(`\n\n> ${serverEnv} /     URL ${serverBaseByEmoji}\n`);

  if (showGraphql) {
    console.log(`> ${serverEnv} / GRAPHQL ${serverGraphqlByEmoji}\n`);
  }
};

export const cliUtil = {
  emoji,
};
