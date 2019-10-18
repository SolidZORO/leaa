const getSlug = (str: string): string => {
  const trimStr = str ? str.trim().toLowerCase() : str;

  if (/^[\w]/.test(trimStr)) {
    return trimStr
      .replace(/[^\w\-\s]/g, '-') // remove `non-english` to `-`
      .replace(/\s/g, '-') // remove `space` to `-`
      .replace(/-+/g, '-') // remove `--` to `-`
      .replace(/(.*)-$/g, '$1'); // remove last `-`
  }

  return trimStr;
};

export const stringUtil = {
  getSlug,
};
