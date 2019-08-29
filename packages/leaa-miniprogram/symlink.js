const path = require('path');
const fs = require('fs');

const sourceDirPath = path.resolve(__dirname, '../_leaa-common/src');
const distDirPath = './src';

// prettier-ignore
const symlinkPaths = [
  'graphqls',
  'dtos',
  'entrys',
];

symlinkPaths.forEach(path => {
  const sourcePath = `${sourceDirPath}/${path}`;
  const distPath = `${distDirPath}/${path}`;

  if (fs.existsSync(distPath)) {
    // fs.unlinkSync(distPath);
    return;
  }

  console.log(`SYMLINK: ${sourcePath} --> ${distPath}`);

  fs.symlinkSync(sourcePath, distPath, 'dir');
});
