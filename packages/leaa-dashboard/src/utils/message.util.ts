import { message } from 'antd';

const formatGqlmessage = (str: string): string => {
  console.log(str);

  return str.replace(/(GraphQL error:|Context creation failed:)\s?/, '');
};

const gqlError = (msg?: string): void => {
  message.error(formatGqlmessage(msg || 'Error'));
};

const gqlCompleted = (msg?: string): void => {
  message.success(msg || 'Completed');
};

export const messageUtil = {
  formatGqlmessage,
  gqlCompleted,
  gqlError,
};
