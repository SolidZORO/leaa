const moduleAlias = require('./tools/module-alias');

moduleAlias.addPath(__dirname);
moduleAlias.addAliases({
  '@leaa/common': '_leaa-common/src',
  '@leaa/www': 'leaa-www',
});

moduleAlias({});

require('./server');
