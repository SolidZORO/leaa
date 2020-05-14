import { message } from 'antd';

import { ERROR_MESSAGE, SUCCESS_MESSAGE } from '@leaa/dashboard/src/constants';

export const errorMsg = (m?: string): void => {
  message.error(m || ERROR_MESSAGE);
};

export const msg = (m?: string): void => {
  message.success(m || SUCCESS_MESSAGE);
};
