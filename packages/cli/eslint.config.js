import baseConfig from '../eslint/index.js';

export default [
  ...baseConfig,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json', '../../config/tsconfig.eslint.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: ['./tsconfig.json', '../../config/tsconfig.eslint.json'],
          alwaysTryTypes: true,
        },
      },
    },
    rules: {
      // Package-spezifische Regeln für CLI
      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: true,
          optionalDependencies: false,
          peerDependencies: false,
        },
      ],
      // Erlaube relative Imports innerhalb des Packages
      'import/no-relative-parent-imports': 'off',
    },
  },
];
