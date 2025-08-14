import eslintConfig from '@munirmardinli-dev/eslint';

export default eslintConfig({
  files: ['**/*.{ts}'],
  ignores: [
    'eslint.config.ts',
    'node_modules/',
    'lib/',
    'public',
    '/assets',
    'config/docs',
    'venv/',
    'dotenv.d.ts',
  ],
  project: ['./config/tsconfig/tsconfig.eslint.json'],
  yamlProjects: [
    './packages/cli/tsconfig.json',
    './config/tsconfig/tsconfig.eslint.json',
  ],
});
