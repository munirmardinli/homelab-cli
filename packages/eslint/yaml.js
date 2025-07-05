import yamlParser from 'yaml-eslint-parser';
import yml from 'eslint-plugin-yml';
import prettier from 'eslint-plugin-prettier';

export default [
  {
    files: ['*.yaml', '*.yml'],
    languageOptions: {
      parser: yamlParser,
      parserOptions: {
        defaultYAMLVersion: '1.2',
        project: ['../../config/tsconfig.eslint.json'],
      },
    },
    plugins: {
      yml,
      prettier,
    },
    rules: {
      'prettier/prettier': 'error',
      'quotes': ['error', 'single'],
      'yml/quotes': ['error', { prefer: 'single' }],
      'yml/no-empty-mapping-value': 'error',
      'yml/no-empty-sequence-entry': 'error',
      'yml/no-empty-document': 'error',
      'yml/no-empty-key': 'error',
    },
  },
];
