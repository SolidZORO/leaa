import React from 'react';
import { message } from 'antd';

import { ERROR_MESSAGE, SUCCESS_MESSAGE } from '@leaa/dashboard/src/constants';

export const errorMsg = (m?: React.ReactNode | string): void => {
  message.error(m || ERROR_MESSAGE);
};

export const msg = (m?: React.ReactNode | string): void => {
  message.success(m || SUCCESS_MESSAGE);
};
