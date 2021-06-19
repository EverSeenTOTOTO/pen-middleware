module.exports = {
  env: {
    es2021: true,
    node: true,
    browser: true,
    'jest/globals': true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'airbnb-typescript',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
    project: './tsconfig.eslint.json',
  },
  plugins: [
    '@typescript-eslint',
    'jest',
  ],
  rules: {
    'arrow-body-style': 'off',
    'max-len': 'off',
    'no-console': 'off',
    'no-plusplus': 'off',
    'no-continue': 'off',
    'no-nested-ternary': 'off',
    'no-restricted-syntax': 'off',
    '@typescript-eslint/no-unused-expressions': 'off',
  },
  overrides: [
    {
      files: ['src/spa/**/*.tsx'],
      rules: {
        'import/no-extraneous-dependencies': 'off',
      },
    },
  ],
};
