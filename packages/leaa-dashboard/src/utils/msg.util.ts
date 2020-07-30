import React from 'react';
import { message } from 'antd';

import { ERROR_MESSAGE, SUCCESS_MESSAGE } from '@leaa/dashboard/src/constants';
import { IHttpError } from '@leaa/dashboard/src/interfaces';

export function httpErrorMsg(err: IHttpError): void {
  message.error(err.response?.data?.message || err.message || ERROR_MESSAGE);
}

export function errorMsg(m?: React.ReactNode | string): void {
  message.error(m || ERROR_MESSAGE);
}

export function msg(m?: React.ReactNode | string): void {
  message.success(m || SUCCESS_MESSAGE);
}
