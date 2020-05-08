import { logger } from '@leaa/api/src/utils/logger.util';
import i18next, { TFunctionKeys, InitOptions } from 'i18next';
import { IGqlCtx } from '@leaa/api/src/interfaces';

interface IHandleMessageParams {
  type: 'error' | 'message';
  text?: string;
  t?: [TFunctionKeys | TFunctionKeys[], InitOptions | { [key: string]: any }] | [TFunctionKeys | TFunctionKeys[]];
  statusCode?: number;
  gqlCtx?: IGqlCtx;
  CLS_NAME?: string;
}

type IErrorParams = Omit<IHandleMessageParams, 'type'>;
type IMessageParams = Omit<IHandleMessageParams, 'type'>;

const handleMessage = ({ type, t, text, statusCode, gqlCtx, CLS_NAME }: IHandleMessageParams) => {
  const ctxLang = gqlCtx?.lang;
  const ctxUser = gqlCtx?.user;

  let message = '';
  let userText = 'Not Found User';

  if (ctxUser) {
    userText = `#${ctxUser.id} - ${ctxUser.name} (${ctxUser.email})`;
  }

  if (t) {
    const tOption = t[1] ? { ...t[1], lng: ctxLang } : { lng: ctxLang };

    // @ts-ignore
    message = i18next.t(t[0], tOption);
  }

  if (text) {
    message = text;
  }

  // why join the statusCode?
  // because the frontend needs to check this statusCode, decide whether to do something.
  // e.g. jwt has expired or error return 401, auth force logout.
  if (statusCode) {
    message += `__STATUS_CODE__${statusCode}`;
  }

  if (type === 'error') {
    logger.error(`${message} / <${userText}>`, CLS_NAME || 'msgError');
    return Error(message);
  }

  return message;
};

export const msgError = ({ t, text, statusCode, gqlCtx, CLS_NAME }: IErrorParams): Error =>
  handleMessage({ type: 'error', t, text, statusCode, gqlCtx, CLS_NAME }) as Error;

export const msgMessage = ({ t, text, statusCode, gqlCtx, CLS_NAME }: IMessageParams): string =>
  handleMessage({ type: 'message', t, text, statusCode, gqlCtx, CLS_NAME }) as string;
