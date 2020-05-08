export const removeLangSpace = (string: string, lang: string): string => {
  if (lang === 'zh-CN') {
    return string.replace(' ', '');
  }

  return string;
};

export const getCurrentLang = (): string | null => localStorage.getItem('i18nextLng');
