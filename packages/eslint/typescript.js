import parser from '@typescript-eslint/parser';
import tseslintPlugin from '@typescript-eslint/eslint-plugin';
import prettier from 'eslint-plugin-prettier';
import importPlugin from 'eslint-plugin-import';
import unicorn from 'eslint-plugin-unicorn';
import security from 'eslint-plugin-security';
import filenames from 'eslint-plugin-filenames';
import sonarjs from 'eslint-plugin-sonarjs';
import globals from 'globals';

export default [
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser,
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        project: ['../../config/tsconfig.eslint.json', '../../tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
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
          project: ['../../config/tsconfig.eslint.json', '../../tsconfig.json'],
          alwaysTryTypes: true,
        },
        node: {
          extensions: ['.ts', '.js', '.json'],
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

      // Prettier Integration
      'prettier/prettier': 'error',

      // Console und Debugging
      'no-console': 'off',
      'no-debugger': 'warn',

      // TypeScript spezifische Regeln
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
      'no-unsafe-optional-chaining': 'error',
      'no-useless-catch': 'warn',

      // Security Regeln
      'security/detect-non-literal-require': 'warn',
      'security/detect-eval-with-expression': 'warn',
      'security/detect-child-process': 'warn',
      'security/detect-unsafe-regex': 'warn',
      'security/detect-new-buffer': 'warn',
      'security/detect-non-literal-regexp': 'off',
      'security/detect-no-csrf-before-method-override': 'warn',

      // Import Regeln für Monorepo
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
      'import/no-relative-parent-imports': 'error',

      // Code Quality
      'consistent-return': 'warn',
      'no-implicit-coercion': 'error',
      'no-implicit-globals': 'error',
      'no-invalid-this': 'error',
      'no-multi-assign': 'error',

      // Formatierung
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

      // TypeScript spezifische Regeln
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^PrismaClient$',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/prefer-includes': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/require-await': 'error',
      '@typescript-eslint/return-await': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-string-starts-ends-with': 'error',
      '@typescript-eslint/prefer-ts-expect-error': 'error',

      // Import Order für Monorepo
      'import/order': [
        'warn',
        {
          'groups': [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
            'type',
          ],
          'pathGroups': [
            {
              pattern: '@homelab-cli/**',
              group: 'internal',
              position: 'after',
            },
          ],
          'newlines-between': 'always',
          'alphabetize': { order: 'asc', caseInsensitive: true },
        },
      ],

      // SonarJS Regeln
      'sonarjs/no-duplicate-string': 'warn',
      'sonarjs/no-identical-functions': 'warn',
      'sonarjs/no-small-switch': 'warn',
      'sonarjs/no-nested-template-literals': 'warn',
      'sonarjs/cognitive-complexity': 'off',
      'sonarjs/no-redundant-boolean': 'error',
      'sonarjs/no-identical-expressions': 'error',

      // Node.js Regeln
      'node/no-unsupported-features/es-syntax': 'off',
      'node/no-missing-import': 'off',
      'node/no-unpublished-import': 'off',
      'node/no-unsupported-features/node-builtins': 'off',

      // Komplexität und Limits
      'max-params': ['warn', 4],
      'max-depth': 'off',
      'max-lines': ['warn', 700],
      'max-lines-per-function': ['warn', 180],
      'complexity': ['warn', 50],

      // Best Practices
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

      // Naming Conventions
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
        {
          selector: 'typeAlias',
          format: ['PascalCase'],
        },
        {
          selector: 'enum',
          format: ['PascalCase'],
        },
        {
          selector: 'enumMember',
          format: ['UPPER_CASE'],
        },
      ],

      // Unicorn Regeln
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
      'unicorn/prefer-ternary': 'error',
      'unicorn/no-lonely-if': 'error',
      'unicorn/prefer-logical-operator-over-ternary': 'error',

      // Filename Regeln
      'filenames/match-regex': 'off',
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
      'import/no-default-export': 'off',
    },
  },
  {
    files: ['**/packages/**/*.ts'],
    rules: {
      'import/no-relative-parent-imports': 'off',
      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: true,
          optionalDependencies: false,
          peerDependencies: false,
        },
      ],
    },
  },
  {
    files: ['**/packages/**/src/**/*.ts'],
    rules: {
      'import/no-relative-parent-imports': 'error',
    },
  },
];
