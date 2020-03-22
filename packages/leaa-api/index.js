const moduleAlias = require('module-alias');

// console.log(`\n__dirname: ${__dirname} ----\n`);

moduleAlias.addPath(__dirname);
moduleAlias.addAliases({
  '@leaa/common': '_build/_leaa-common',
  '@leaa/api': '_build/leaa-api',
});

moduleAlias({});

console.log('\n\n\n\n---- hello, leaa-api-server. ----\n\n');

require('./_build/leaa-api/src/main');
