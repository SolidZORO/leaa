export const isAt2x = (originalname: string): boolean => /[＠@_]2x/i.test(originalname);

export const filenameAt1xToAt2x = (filename: string): string => {
  const ext = `.${filename.split('.').pop()}`;

  return filename.replace(ext, `_2x${ext}`);
};
