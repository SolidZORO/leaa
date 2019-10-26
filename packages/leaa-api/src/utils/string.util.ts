const getSlug = (str: string, secondChoiceStr?: string): string => {
  const trimStr = str ? str.trim().toLowerCase() : str;

  let nextStr = trimStr;

  if (/[\w]/.test(trimStr)) {
    nextStr = trimStr
      .replace(/[^\w\-\s]/g, '-') // remove `non-english` to `-`
      .replace(/\s/g, '-') // remove `space` to `-`
      .replace(/-+/g, '-') // remove `--` to `-`
      .replace(/^-(.*)/g, '$1') // remove frist `-`
      .replace(/(.*)-$/g, '$1'); // remove last `-`
  }

  if (!nextStr && secondChoiceStr) {
    nextStr = secondChoiceStr;
  }

  return nextStr;
};

export const stringUtil = {
  getSlug,
};
