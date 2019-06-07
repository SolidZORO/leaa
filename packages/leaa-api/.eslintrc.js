module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: '2018',
    sourceType: 'module',
    project: './tsconfig.json',
    ecmaFeatures: {
      jsx: true,
    },
  },
  extends: [
    'airbnb',
    'airbnb-typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:css-modules/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['@typescript-eslint', 'react', 'typescript', 'import', 'css-modules'],
  globals: {
    __DEV__: true,
    status: false,
  },
  env: {
    es6: true,
    browser: true,
    jest: true,
    node: true,
  },
  rules: {
    'no-console': 0,
    'no-var-requires': 0,
    'no-underscore-dangle': ['error', { allow: ['__DEV__', '_insertCss'] }],
    //
    'operator-linebreak': 0,
    'object-curly-newline': 0,
    semi: ['error', 'always'],
    'lines-between-class-members': 0,
    'prefer-destructuring': [
      'error',
      {
        object: true,
        array: false,
      },
    ],
    'import/prefer-default-export': 0,
    //
    'react/forbid-prop-types': 0,
    'react/destructuring-assignment': 0,
    'react/jsx-one-expression-per-line': 0,
    'react/sort-comp': 0,
    //
    //
    'css-modules/no-unused-class': 0,
    //
    //
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/indent': ['error', 2],
    '@typescript-eslint/explicit-member-accessibility': 0,
    '@typescript-eslint/interface-name-prefix': 0,
    '@typescript-eslint/no-unused-vars': 0,
    '@typescript-eslint/camelcase': ['error', { properties: 'never' }],
    '@typescript-eslint/no-empty-interface': 0,
    //
    //
    // TODO 具有破坏性，全部修复后，尽量注释掉
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/ban-types': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    //
    //
    // FOR NESTJS
    '@typescript-eslint/no-parameter-properties': 0,
    'no-useless-constructor': 0,
    'no-empty-function': 0,
    'class-methods-use-this': 0,
    //
    'prettier/prettier': 'error',
  },
  settings: {
    'import/resolver': {
      node: {
        moduleDirectory: ['node_modules', 'src'],
      },
    },
  },
};
