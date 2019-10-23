const formatGqlmessage = (string: string): string => {
  console.log(string);

  return string.replace(/GraphQL\serror:\s?/, '');
};

export const messageUtil = {
  formatGqlmessage,
};
