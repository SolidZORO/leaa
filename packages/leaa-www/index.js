const moduleAlias = require('module-alias');

moduleAlias.addPath(__dirname);
moduleAlias.addAliases({
  '@leaa/common': '_dist/_leaa-common',
  '@leaa/www': '_dist/leaa-www',
});

moduleAlias({});

require('./_dist/leaa-www/server');
