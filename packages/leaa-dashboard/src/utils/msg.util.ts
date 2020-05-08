import { message } from 'antd';

import { ERROR_MESSAGE, SUCCESS_MESSAGE } from '@leaa/dashboard/src/constants';

export const errorMessage = (msg: string): void => {
  message.error(msg || ERROR_MESSAGE);
};

export const successMessage = (msg?: string): void => {
  message.success(msg || SUCCESS_MESSAGE);
};
