import js from '@eslint/js';
import parser from '@typescript-eslint/parser';
import tseslintPlugin from '@typescript-eslint/eslint-plugin';
import prettier from 'eslint-plugin-prettier';
import importPlugin from 'eslint-plugin-import';
import unicorn from 'eslint-plugin-unicorn';
import security from 'eslint-plugin-security';
import filenames from 'eslint-plugin-filenames';
import sonarjs from 'eslint-plugin-sonarjs';
import yml from 'eslint-plugin-yml';
import json from 'eslint-plugin-json';
import yamlParser from 'yaml-eslint-parser';
import globals from 'globals';

export default [
  {
    ignores: ['node_modules/', 'lib/', 'docs/'],
  },
  js.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser,
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        project: ['config/tsconfig.eslint.json', 'tsconfig.json'],
      },
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        ...globals.node,
        ...globals.jest,
      },
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: ['config/tsconfig.eslint.json', 'tsconfig.json'],
        },
        node: {
          extensions: ['.ts'],
        },
      },
      'import/ignore': ['node_modules', '\\.(scss|css|less|json)$'],
      'import/parser': {
        '@typescript-eslint/parser': ['.ts'],
      },
      'import/cache': {
        lifetime: 5,
      },
    },
    plugins: {
      '@typescript-eslint': tseslintPlugin,
      prettier,
      'import': importPlugin,
      unicorn,
      security,
      filenames,
      sonarjs,
    },
    rules: {
      ...tseslintPlugin.configs.recommended.rules,
      'no-console': 'off',
      'prettier/prettier': 'error',
      'no-unused-vars': 'off',
      'no-undef': 'off',
      'no-unused-expressions': 'off',
      'no-throw-literal': 'off',
      'no-duplicate-imports': 'off',
      'no-duplicate-case': 'off',
      'no-duplicate-labels': 'off',
      'no-duplicate-keys': 'off',
      'no-constant-condition': 'off',
      'no-unsafe-finally': 'off',
      'no-unsafe-negation': 'off',
      'security/detect-non-literal-require': 'warn',
      'security/detect-eval-with-expression': 'warn',
      'security/detect-child-process': 'warn',
      'security/detect-unsafe-regex': 'warn',
      'security/detect-new-buffer': 'warn',
      'security/detect-non-literal-regexp': 'off',
      'security/detect-no-csrf-before-method-override': 'warn',
      'no-unsafe-optional-chaining': 'error',
      'no-useless-catch': 'warn',
      'filenames/match-regex': 'off',
      'import/no-default-export': 'error',
      'import/named': 'error',
      'import/namespace': 'error',
      'import/default': 'error',
      'import/export': 'error',
      'import/no-dynamic-require': 'warn',
      'import/no-useless-path-segments': 'error',
      'import/no-cycle': 'warn',
      'import/no-extraneous-dependencies': 'error',
      'import/newline-after-import': 'error',
      'import/no-self-import': 'error',
      'consistent-return': 'warn',
      'no-implicit-coercion': 'error',
      'no-implicit-globals': 'error',
      'no-invalid-this': 'error',
      'no-multi-assign': 'error',
      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],
      'linebreak-style': ['error', 'unix'],
      'camelcase': [
        'error',
        {
          properties: 'always',
        },
      ],
      'eqeqeq': ['error', 'smart'],
      'no-multi-spaces': 'error',
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }],
      'no-trailing-spaces': 'error',
      'no-underscore-dangle': ['error', { allow: ['_id', '_key'] }],
      'no-param-reassign': ['error', { props: false }],
      'no-useless-escape': 'error',
      'no-useless-return': 'error',
      'no-useless-concat': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^PrismaClient$' },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/interface-name-prefix': 'off',
      'import/order': [
        'warn',
        {
          'groups': [
            ['builtin', 'external'],
            ['internal', 'sibling', 'parent', 'index'],
          ],
          'newlines-between': 'always',
          'alphabetize': { order: 'asc', caseInsensitive: true },
        },
      ],
      'sonarjs/no-duplicate-string': 'warn',
      'sonarjs/no-identical-functions': 'warn',
      'sonarjs/no-small-switch': 'warn',
      'sonarjs/no-nested-template-literals': 'warn',
      'sonarjs/cognitive-complexity': 'off',
      'node/no-unsupported-features/es-syntax': 'off',
      'node/no-missing-import': 'off',
      'node/no-unpublished-import': 'off',
      'node/no-unsupported-features/node-builtins': 'off',
      'max-params': ['warn', 4],
      'max-depth': 'off',
      'max-lines': ['warn', 700],
      'array-callback-return': 'error',
      'curly': 'error',
      'default-case': 'error',
      'dot-notation': 'error',
      'no-alert': 'error',
      'no-caller': 'error',
      'no-empty-function': 'error',
      'no-floating-decimal': 'error',
      'no-implied-eval': 'error',
      'no-labels': 'error',
      'no-lone-blocks': 'error',
      'no-new-func': 'error',
      'no-new-wrappers': 'error',
      'no-octal': 'error',
      'no-redeclare': 'error',
      'no-script-url': 'error',
      'no-sequences': 'error',
      'no-void': 'error',
      'radix': 'error',
      'yoda': 'error',
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/prefer-includes': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'interface',
          format: ['PascalCase'],
          custom: {
            regex: '^I?[A-Z][A-Za-z0-9]*$',
            match: true,
          },
        },
      ],

      'unicorn/prefer-module': 'error',
      'unicorn/prefer-node-protocol': 'error',
      'unicorn/no-array-reduce': 'error',
      'unicorn/no-array-for-each': 'error',
      'unicorn/prefer-array-find': 'error',
      'unicorn/prefer-array-some': 'error',
      'unicorn/prefer-array-index-of': 'error',
      'unicorn/prefer-date-now': 'error',
      'unicorn/prefer-default-parameters': 'error',
      'unicorn/prefer-optional-catch-binding': 'error',
      'unicorn/prefer-string-slice': 'error',
      'unicorn/prefer-string-starts-ends-with': 'error',
      'unicorn/prefer-string-trim-start-end': 'error',
      'unicorn/prefer-spread': 'error',
      'unicorn/require-array-join-separator': 'error',
      'unicorn/require-number-to-fixed-digits-argument': 'error',
    },
  },
  {
    files: ['*.d.ts'],
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'filenames/match-regex': 'off',
      'node/no-unpublished-import': 'off',
      'no-process-exit': 'warn',
    },
  },
  {
    files: ['*.yaml', '*.yml'],
    languageOptions: {
      parser: yamlParser,
      parserOptions: {
        defaultYAMLVersion: '1.2',
        project: ['./config/tsconfig.eslint.json'],
      },
    },
    plugins: {
      yml,
      prettier,
    },
    rules: {
      'prettier/prettier': 'error',
      'quotes': ['error', 'single'],
    },
  },
  {
    files: ['**/*.json'],
    plugins: {
      json,
    },
    processor: json.processors['json'],
    rules: {
      'json/*': ['error', 'allowComments'],
    },
  },
];
