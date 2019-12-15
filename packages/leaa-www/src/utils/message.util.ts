import { message } from 'antd';
import { ERROR_MESSAGE, SUCCESS_MESSAGE, GQL_ERROR_MESSAGE, GQL_SUCCESS_MESSAGE } from '@leaa/www/src/constants';

const formatGqlmessage = (str: string): string => {
  return str.replace(/(GraphQL error:|Context creation failed:)\s?/, '');
};

const error = (msg: string): void => {
  message.error(msg || ERROR_MESSAGE);
};

const success = (msg: string): void => {
  message.success(msg || SUCCESS_MESSAGE);
};

const gqlError = (msg?: string): void => {
  message.error(formatGqlmessage(msg || GQL_ERROR_MESSAGE));
};

const gqlSuccess = (msg?: string): void => {
  message.success(formatGqlmessage(msg || GQL_SUCCESS_MESSAGE));
};

export const messageUtil = {
  formatGqlmessage,
  gqlSuccess,
  gqlError,
  error,
  success,
};
