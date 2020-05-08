import { message as antdMessage } from 'antd';

import { ERROR_MESSAGE, SUCCESS_MESSAGE } from '@leaa/dashboard/src/constants';

export const msgError = (msg: string): void => {
  antdMessage.error(msg || ERROR_MESSAGE);
};

export const msgMessage = (msg?: string): void => {
  antdMessage.success(msg || SUCCESS_MESSAGE);
};
