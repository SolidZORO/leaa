const tasks = (arr) => arr.join(' && ');

// ALL GIT HOOKS DEFINED HERE ARE SUPPORTED
// https://git-scm.com/docs/githooks

module.exports = {
  hooks: {
    // https://www.npmjs.com/package/commitizen
    'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS',

    'pre-commit': tasks([
      // https://github.com/azz/pretty-quick
      'pretty-quick --staged',

      // https://github.com/okonet/lint-staged#configuration.
      'lint-staged',
    ]),
  },
};
