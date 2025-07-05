import baseConfig from './packages/eslint/index.js';

export default [
  ...baseConfig,
  {
    files: ['src/**/*.ts'],
    rules: {
      'import/no-relative-parent-imports': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
    },
  },
];
