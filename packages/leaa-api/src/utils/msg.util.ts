import { loggerUtil } from '@leaa/api/src/utils/logger.util';
import { User } from '@leaa/common/src/entrys';
import i18next, { TFunctionKeys, InitOptions } from 'i18next';
import { IGqlCtx } from '@leaa/api/src/interfaces';

interface IHandleMessageParams {
  type: 'error' | 'message';
  text?: string;
  t?: [TFunctionKeys | TFunctionKeys[], InitOptions | { [key: string]: any }] | [TFunctionKeys | TFunctionKeys[]];
  user?: User;
  statusCode?: number;
  gqlCtx?: IGqlCtx;
  CLS_NAME?: string;
}

type IErrorParams = Omit<IHandleMessageParams, 'type'>;
type IMessageParams = Omit<IHandleMessageParams, 'type'>;

const handleMessage = ({ type, t, text, statusCode, user, gqlCtx, CLS_NAME }: IHandleMessageParams) => {
  const ctxLang = gqlCtx?.lang;
  const ctxUser = gqlCtx?.user;

  let message = '';
  let userText = 'Not Found User';

  if (user || ctxUser) {
    const u = user || ctxUser;

    if (u) {
      userText = `#${u.id} - ${u.name} (${u.email})`;
    }
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
    loggerUtil.error(`${message} / <${userText}>`, CLS_NAME || 'msgUtil');
    throw Error(message);
  }

  return message;
};

const error = ({ t, text, statusCode, user, gqlCtx, CLS_NAME }: IErrorParams) =>
  handleMessage({ type: 'error', t, text, statusCode, user, gqlCtx, CLS_NAME });

const message = ({ t, text, statusCode, user, gqlCtx, CLS_NAME }: IMessageParams) =>
  handleMessage({ type: 'message', t, text, statusCode, user, gqlCtx, CLS_NAME });

export const msgUtil = {
  error,
  message,
};
