const moduleAlias = require('module-alias');

moduleAlias.addPath(__dirname);
moduleAlias.addAliases({
  '@leaa/common': '_dist/_leaa-common',
  '@leaa/api': '_dist/leaa-api',
});

moduleAlias({});

require('./_dist/leaa-api/src/main');
