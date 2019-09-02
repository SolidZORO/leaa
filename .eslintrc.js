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
  plugins: ['@typescript-eslint', 'react', 'import', 'css-modules'],
  extends: [
    'airbnb',
    'airbnb-typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:css-modules/recommended',
    'plugin:prettier/recommended',
  ],
  globals: {
    __DEV__: true,
    status: false,
  },
  env: {
    es6: true,
    browser: true,
    jest: false,
    node: true,
  },
  rules: {
    'max-len': [2, 120],
    'no-console': 0,
    'no-var-requires': 0,
    'no-underscore-dangle': ['error', { allow: ['__DEV__', '_insertCss'] }],
    //
    'dot-notation': 0,
    'operator-linebreak': 0,
    'object-curly-newline': 0,
    semi: ['error', 'always'],
    'lines-between-class-members': 0,
    'import/prefer-default-export': 0,
    //
    // 'react/forbid-prop-types': 0,
    'react/prop-types': 0,
    'react/destructuring-assignment': 0,
    'react/jsx-one-expression-per-line': 0,
    'react/jsx-wrap-multilines': 0,
    'react/sort-comp': 0,
    'react/jsx-props-no-spreading': 0,
    'react/react-in-jsx-scope': 0,
    //
    // CSS
    'css-modules/no-unused-class': 0,
    //
    // TYPESCRIPT
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/indent': 0,
    '@typescript-eslint/explicit-member-accessibility': 0,
    '@typescript-eslint/interface-name-prefix': 0,
    '@typescript-eslint/no-unused-vars': 0,
    '@typescript-eslint/camelcase': [1, { properties: 'never' }],
    '@typescript-eslint/no-empty-interface': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/ban-ts-ignore': 0,
    '@typescript-eslint/no-parameter-properties': 0,
    //
    // NEST.JS
    'no-useless-constructor': 0,
    'no-empty-function': 0,
    'class-methods-use-this': 0,
    //
    // NEXT.JS
    'jsx-a11y/anchor-is-valid': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    //
    // MONOREPO
    'prettier/prettier': 'error',
    'import/no-extraneous-dependencies': 0,
    'import/no-unresolved': ['error', { ignore: ['@leaa'] }],
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
      },
    },
  },
};
