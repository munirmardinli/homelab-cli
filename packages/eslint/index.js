import js from '@eslint/js';
import typescriptConfig from './typescript.js';
import javascriptConfig from './javascript.js';
import yamlConfig from './yaml.js';
import jsonConfig from './json.js';

export default [
  {
    ignores: [
      'node_modules/',
      'lib/',
      'dist/',
      'build/',
      'coverage/',
      'docs/',
      '*.min.js',
      '*.bundle.js',
      '.husky/',
      '.github/',
      '.vscode/',
      '.cursor/',
      '.devcontainer/',
      '.docker/',
      '.trunk/',
      '.qodo/',
      'packages/**/lib/',
    ],
  },
  js.configs.recommended,
  ...typescriptConfig,
  ...javascriptConfig,
  ...yamlConfig,
  ...jsonConfig,
];
