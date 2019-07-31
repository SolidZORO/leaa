const moduleAlias = require('./tools/module-alias');

moduleAlias.addPath(__dirname);
moduleAlias.addAliases({
  '@leaa/common': '_dist/_leaa-common/src',
  '@leaa/api': '_dist/leaa-api/src',
});

moduleAlias({});

require('./_dist/leaa-api/src/main');
