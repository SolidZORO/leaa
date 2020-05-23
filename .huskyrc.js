const tasks = (arr) => arr.join(' && ');

// ALL GIT HOOKS DEFINED HERE ARE SUPPORTED
// https://git-scm.com/docs/githooks

module.exports = {
  hooks: {
    //this is for linux ==> 'prepare-commit-msg': 'exec < /dev/tty && git cz --hook',
    // https://www.npmjs.com/package/commitizen
    'prepare-commit-msg': 'git cz --hook || true HUSKY_DEBUG',
    'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS HUSKY_USE_YARN',
    'pre-commit': tasks([
      'pretty-quick --staged', // https://github.com/azz/pretty-quick
      'lint-staged', // https://github.com/okonet/lint-staged#configuration.
    ]),
  },
};
