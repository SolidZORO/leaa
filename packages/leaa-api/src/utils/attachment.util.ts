const isAt2x = (originalname: string): boolean => /[＠@_]2x/i.test(originalname);

const filenameAt1xToAt2x = (filename: string): string => {
  const ext = `.${filename.split('.').pop()}`;

  return filename.replace(ext, `_2x${ext}`);
};

export const attachmentUtil = {
  isAt2x,
  filenameAt1xToAt2x,
};
