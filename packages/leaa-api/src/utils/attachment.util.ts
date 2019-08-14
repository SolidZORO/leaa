// import uuid from 'uuid';

const isAt2x = (originalname: string): boolean => /[＠@_]2x/i.test(originalname);

// const getSaveFilename = (originalname: string): string => {
//   const at2x = isAt2x(originalname) ? '_2x' : '';
//   const ext = originalname.split('.').pop();
//
//   return `${uuid.v4()}${at2x}.${ext}`;
// };

export const attachmentUtil = {
  isAt2x,
  // getSaveFilename,
};
