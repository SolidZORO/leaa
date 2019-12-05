const moduleAlias = require('module-alias');

moduleAlias.addPath(__dirname);
moduleAlias.addAliases({
  '@leaa/common': '_dist/_leaa-common',
  '@leaa/api': '_dist/leaa-api',
});

moduleAlias({});

console.log('\n\n\n\n---- hello, leaa-api-server. ----\n\n');

require('./_dist/leaa-api/src/main');
