import path from 'path';

export const getAt2xPath = (filepath: string | null): string | null => {
  if (!filepath) {
    return null;
  }

  /*
   /attachments/2019/07/19744632-558c-483d-b3db-71b0af66fe05.png
    |
    |
    v
   /attachments/2019/07/19744632-558c-483d-b3db-71b0af66fe05_2x.png
  */
  const dir = path.dirname(filepath);
  const basename = path.basename(filepath);
  const filename = basename.split('.').slice(0, -1).join('.');
  const ext = path.extname(filepath);

  // console.log(`${dir}/${filename}@2x${ext}`);

  return `${dir}/${filename}_2x${ext}`;
};
