import { AUTH_EXPIRES_IN_NAME } from '@leaa/dashboard/src/constants';

const removeSpace = (string: string, lang: string): string => {
  if (lang === 'zh-CN') {
    return string.replace(' ', '');
  }

  return string;
};

const getCurrentLang = (): string | null => localStorage.getItem('i18nextLng');

export const langUtil = {
  removeSpace,
  getCurrentLang,
};
