const tasks = (arr) => arr.join(' && ');

module.exports = {
  // ALL GIT HOOKS DEFINED HERE ARE SUPPORTED
  // https://git-scm.com/docs/githooks
  hooks: {
    // https://www.npmjs.com/package/commitizen
    'prepare-commit-msg': 'git cz --hook || true HUSKY_DEBUG',
    //this is for linux ==> 'prepare-commit-msg': 'exec < /dev/tty && git cz --hook',
    'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS HUSKY_USE_YARN',

    'pre-commit': tasks([
      //check nx before committing!!
      // uncommented for now
      //'nx test',
      // pretty quick is explained here
      // https://github.com/azz/pretty-quick
      'pretty-quick --staged',
      // lint-staged is explained here
      // https://github.com/okonet/lint-staged#configuration.
      'lint-staged --debug',
    ]),
  },
};
