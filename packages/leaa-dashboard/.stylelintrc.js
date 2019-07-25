// stylelint configuration
// https://stylelint.io/user-guide/configuration/
module.exports = {
  // The standard config based on a handful of CSS style guides
  // https://github.com/stylelint/stylelint-config-standard
  extends: 'stylelint-config-standard',

  plugins: [
    // stylelint plugin to sort CSS rules content with specified order
    // https://github.com/hudochenkov/stylelint-order
    'stylelint-order',
  ],

  rules: {
    'block-closing-brace-newline-before': null,
    'block-closing-brace-newline-after': null,
    'at-rule-semicolon-newline-after': null,
    'no-descending-specificity': null,
    'at-rule-no-unknown': null,
    'block-no-empty': null,
    'no-empty-source': null,
    'max-empty-lines': 4,
    'selector-pseudo-element-colon-notation': 'single',
    'property-no-unknown': [
      true,
      {
        ignoreProperties: [
          // CSS Modules composition
          // https://github.com/css-modules/css-modules#composition
          'composes',
        ],
      },
    ],

    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: [
          // CSS Modules :global scope
          // https://github.com/css-modules/css-modules#exceptions
          'global',
          'local',
        ],
      },
    ],

    'at-rule-empty-line-before': [
      'always',
      {
        ignore: [
          'after-comment',
          'first-nested',
          'inside-block',
          'blockless-after-same-name-blockless',
          'blockless-after-blockless',
        ],
      },
    ],

    'declaration-block-semicolon-newline-after': null,
    // 'no-invalid-double-slash-comments': null,

    // Opinionated rule, you can disable it if you want
    'string-quotes': 'single',

    // https://github.com/hudochenkov/stylelint-order/blob/master/rules/order/README.md
    'order/order': [],

    // https://github.com/hudochenkov/stylelint-order/blob/master/rules/properties-order/README.md
    'order/properties-order': [],
  },
};
