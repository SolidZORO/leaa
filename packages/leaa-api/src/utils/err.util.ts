import { loggerUtil } from '@leaa/api/src/utils/logger.util';
import { User } from '@leaa/common/src/entrys';

interface IHeaderErrorParams {
  error: string | { CLS_NAME?: string; message?: string };
  user?: User;
  code?: number;
}

interface IMapping {
  [key: string]: { text: string; code?: number };
}

// 401 Unauthorized
// 403 Forbidden
// 400 Bad Request
//
// prettier-ignore
const mapping: IMapping = {
  UNAUTHORIZED:          { text: 'Unauthorized',             code: 401 },
  FORBIDDEN:             { text: 'Forbidden',                code: 403 },
  BAD_REQUEST:           { text: 'Bad Request',              code: 400 },
  //
  TOKEN_NOT_FOUND:       { text: 'Token Not Found',          code: 401 },
  TOKEN_ERROR:           { text: 'Token Error',              code: 401 },
  TOKEN_NOT_BEFORE:      { text: 'Token Not Before',         code: 401 },
  TOKEN_EXPIRED:         { text: 'Token Expired',            code: 401 },
  TOKEN_VERIFY_FAILD:    { text: 'Token Verify Faild',       code: 401 },
  TOKEN_NOT_PREFIX:      { text: 'Token Not Prefix',         code: 401 },
  //
  //
  NOT_AUTH:              { text: 'Not Authorized',           code: 401 },
  NOT_FOUND:             { text: 'Not Found' },
  NOT_FOUND_ARGS:        { text: 'Not Found Args' },
  NOT_FOUND_FIELD:       { text: 'Not Found Field' },
  NOT_FOUND_AUTH:        { text: 'Not Found Auth',           code: 401 },
  NOT_FOUND_ITEM:        { text: 'Not Found Item' },
  NOT_FOUND_ITEMS:       { text: 'Not Found Items' },
  NOT_FOUND_USER:        { text: 'Not Found User' },
  NOT_FOUND_ID:          { text: 'Not Found #ID' },
  NOT_FOUND_TICKET:      { text: 'Not Found Ticket' },
  NOT_FOUND_INFO:        { text: 'Not Found Info' },
  //
  CREATE_ITEM_FAILED:    { text: 'Create Item Failed' },
  DELETE_ITEM_FAILED:    { text: 'Delete Item Failed' },
  //
  ILLEGAL_USER:          { text: 'Illegal User' },
  INVALID_USER:          { text: 'Invalid User' },
  //
  BINDING_FAILED:        { text: 'Binding Failed' },
  USER_HAS_BEEN_UPDATED: { text: 'User Has Been Updated, Please Login Again' },
  PLEASE_DONT_MODIFY:    { text: 'PLEASE DONT MODIFY' },
};

const ERROR = ({ error, user }: IHeaderErrorParams) => {
  const userText = user ? `#${user.id} - ${user.name} (${user.email})` : 'Not User';
  const errorText = typeof error === 'string' ? error : JSON.stringify(error);

  loggerUtil.error(`${errorText} / <${userText}>`, (error && typeof error === 'object' && error.CLS_NAME) || 'ErrUtil');

  throw Error(errorText);
};

export const errUtil = {
  ERROR,
  mapping,
};
