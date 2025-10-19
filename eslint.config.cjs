// Flat config for ESLint v9 — CommonJS
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const prettierPlugin = require('eslint-plugin-prettier');

module.exports = [
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2021,
      sourceType: 'module',
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',

      ...tsPlugin.configs.recommended.rules,

      // інтеграція з Prettier (помилка якщо не відформатовано)
      'prettier/prettier': 'error',
    },
  },
];
