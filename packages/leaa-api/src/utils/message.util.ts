import { loggerUtil } from '@leaa/api/src/utils/logger.util';
import { User } from '@leaa/common/src/entrys';

interface IHeaderErrorParams {
  error: string | { CONSTRUCTOR_NAME?: string; message?: string };
  user?: User;
}

const handleError = ({ error, user }: IHeaderErrorParams) => {
  const userText = user ? `#${user.id} - ${user.name} (${user.email})` : 'NOT-USER';
  const errorText = typeof error === 'string' ? error : JSON.stringify(error);

  loggerUtil.warn(
    `${errorText} / ${userText}`,
    (error && typeof error === 'object' && error.CONSTRUCTOR_NAME) || 'MessageUtil',
  );

  throw Error(errorText);
};

const NOT_AUTH = (params?: { user?: User }) => handleError({ error: 'NOT AUTHORIZED', user: params && params.user });
const NOT_FOUND = (params?: { user?: User }) => handleError({ error: 'NOT FOUND', user: params && params.user });
const ILLEGAL_USER = (params?: { user?: User }) => handleError({ error: 'ILLEGAL USER', user: params && params.user });

export const messageUtil = {
  ERROR: handleError,
  NOT_AUTH,
  NOT_FOUND,
  ILLEGAL_USER,
};
