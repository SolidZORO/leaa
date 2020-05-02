/*
 running on severless (now.sh)
 */
const moduleAlias = require('module-alias');

moduleAlias.addPath(__dirname);
moduleAlias.addAliases({
  '@leaa/common': '_build/_leaa-common',
  '@leaa/www': '_build/leaa-www',
});

moduleAlias({});

require('./_build/leaa-www/server');
