import { message as antdMessage } from 'antd';

import { ERROR_MESSAGE, SUCCESS_MESSAGE } from '@leaa/dashboard/src/constants';

const error = (msg: string): void => {
  antdMessage.error(msg || ERROR_MESSAGE);
};

const message = (msg?: string): void => {
  antdMessage.success(msg || SUCCESS_MESSAGE);
};

export const msgUtil = {
  message,
  error,
};
