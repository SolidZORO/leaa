import { loggerUtil } from '@leaa/api/src/utils/logger.util';
import { User } from '@leaa/common/src/entrys';
import i18next, { TFunctionKeys, InitOptions } from 'i18next';
import { IGqlCtx } from '@leaa/api/src/interfaces';

type IError =
  | '_error:test'
  // _error:
  | '_error:unauthorized'
  | '_error:forbidden'
  | '_error:badRequest'
  // _error:
  | '_error:tokenNotFound'
  | '_error:tokenError'
  | '_error:tokenNotBefore'
  | '_error:tokenExpired'
  | '_error:tokenVerifyFaild'
  | '_error:tokenNotPrefix'
  // _error:
  // _error:
  | '_error:notAuth'
  | '_error:notFound'
  | '_error:notFoundArgs'
  | '_error:notFoundField'
  | '_error:notFoundAuth'
  | '_error:notFoundItem'
  | '_error:notFoundItems'
  | '_error:notFoundUser'
  | '_error:notFoundId'
  | '_error:notFoundTicket'
  | '_error:notFoundInfo'
  // _error:
  | '_error:createItemFailed'
  | '_error:updateItemFailed'
  | '_error:readItemFailed'
  | '_error:deleteItemFailed'
  // _error:
  | '_error:illegalUser'
  | '_error:invalidUser'
  // _error:
  | '_error:userInfoNotMatch'
  | '_error:bindingFailed'
  | '_error:signupFailed'
  | '_error:userHasBeenUpdated'
  | '_error:pleaseDontModify';

interface IMessageParams {
  text?: string;
  // t?: [IError] | [IError, InitOptions | { [key: string]: any }];
  t?:
    | [IError | TFunctionKeys | TFunctionKeys[], InitOptions | { [key: string]: any }]
    | [IError | TFunctionKeys | TFunctionKeys[]];
  user?: User;
  statusCode?: number;
  gqlCtx?: IGqlCtx;
  CLS_NAME?: string;
}

const error = ({ t, text, statusCode, user, gqlCtx, CLS_NAME }: IMessageParams) => {
  const ctxLang = gqlCtx?.lang;
  const ctxUser = gqlCtx?.user;

  let errorText = '';
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
    errorText = i18next.t(t[0], tOption);
  }

  if (text) {
    errorText = text;
  }

  // why join the statusCode?
  // because the frontend needs to check this statusCode, decide whether to do something.
  // e.g. jwt has expired or error return 401, auth force logout.
  if (statusCode) {
    errorText += `__STATUS_CODE__${statusCode}`;
  }

  loggerUtil.error(`${errorText} / <${userText}>`, CLS_NAME || 'msgUtil');

  throw Error(errorText);
};

const message = ({ text }: IMessageParams) => {
  return text;
};

export const msgUtil = {
  error,
  message,
};
