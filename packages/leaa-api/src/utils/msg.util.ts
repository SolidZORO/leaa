import { logger } from '@leaa/api/src/utils/logger.util';
import { IGqlCtx } from '@leaa/api/src/interfaces';

interface IHandleMessageParams {
  type: 'error' | 'message';
  statusCode?: number;
  gqlCtx?: IGqlCtx;
  CLS_NAME?: string;
  language?: string;
}

type IErrorParams = Omit<IHandleMessageParams, 'type'>;
type IMessageParams = Omit<IHandleMessageParams, 'type'>;

const handleMessage = (msgText: string, params?: IHandleMessageParams) => {
  const ctxUser = params?.gqlCtx?.user;

  let message = msgText || '';
  let userText = 'Not Found User';

  if (ctxUser) {
    userText = `#${ctxUser.id} - ${ctxUser.name} (${ctxUser.email})`;
  }

  // why join the statusCode?
  // because the frontend needs to check this statusCode, decide whether to do something.
  // e.g. jwt has expired or error return 401, auth force logout.
  if (params?.statusCode) {
    message += `__STATUS_CODE__${params?.statusCode}`;
  }

  if (params?.type === 'error') {
    logger.error(`${message} / <${userText}>`, params?.CLS_NAME || 'errorMsg');
    return Error(message);
  }

  return message;
};

export const errorMsg = (msgText: string, params?: IErrorParams): Error => {
  return handleMessage(msgText, { ...params, type: 'error' }) as Error;
};

export const msg = (msgText: string, params?: IMessageParams): string => {
  return handleMessage(msgText, { ...params, type: 'message' }) as string;
};

export const msgT = (msgText: string, params?: IMessageParams): string => {
  return handleMessage(msgText, { ...params, type: 'message' }) as string;
};
