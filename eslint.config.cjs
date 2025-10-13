// eslint.config.cjs
import type { FlatESLintConfig } from 'eslint';

const config: FlatESLintConfig = {
  root: true,
  languageOptions: {
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
    },
  },
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  plugins: {
    '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
    prettier: require('eslint-plugin-prettier'),
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    'prettier/prettier': 'error',
  },
};

export default config;
