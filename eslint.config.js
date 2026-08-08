const jsxA11y = require('eslint-plugin-jsx-a11y');
const tsParser = require('@typescript-eslint/parser');

module.exports = [
  {
    files: ['src/**/*.tsx'],
    plugins: { 'jsx-a11y': jsxA11y },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      ...jsxA11y.flatConfigs.recommended.rules,
    },
  },
];
