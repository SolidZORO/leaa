export const emoji = ({
  PROTOCOL,
  PORT,
  BASE_HOST,
  NODE_ENV,
  showGraphql,
}: {
  PROTOCOL: string;
  PORT: string;
  BASE_HOST: string;
  NODE_ENV: string;
  showGraphql?: boolean;
}) => {
  // emoji for CLI
  const serverBaseByText = `${PROTOCOL}://${BASE_HOST}:${PORT}`;
  const serverBaseByEmoji = `✨✨ \x1b[00;44;9m${serverBaseByText}\x1b[0m ✨✨`;
  const serverGraphqlByEmoji = `✨✨ \x1b[00;41;9m${serverBaseByText}/graphql\x1b[0m ✨✨`;

  console.log(`\n\n> ${NODE_ENV} URL ${serverBaseByEmoji}\n`);

  if (showGraphql) {
    console.log(`> ${NODE_ENV} GQL ${serverGraphqlByEmoji}\n\n`);
  }
};

export const cliUtil = {
  emoji,
};
