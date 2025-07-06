import baseConfig from '@homelab-cli/eslint';

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
