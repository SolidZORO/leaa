const removeSpace = (string: string, lang: string): string => {
  if (lang === 'zh-CN') {
    return string.replace(' ', '');
  }

  return string;
};

export const langUtil = {
  removeSpace,
};
