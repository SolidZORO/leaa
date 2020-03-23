const tasks = (arr) => arr.join(' && ');

module.exports = {
  hooks: {
    'pre-commit': tasks([
      //check nx before committing!!
      // uncommented for now
      //'nx test',
      // pretty quick is explained here
      // https://github.com/azz/pretty-quick
      'pretty-quick --staged',
      // lint-staged is explained here
      // https://github.com/okonet/lint-staged#configuration.
      'lint-staged',
    ]),
  },
};
