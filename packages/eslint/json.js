import json from 'eslint-plugin-json';

export default [
  {
    files: ['**/*.json'],
    plugins: {
      json,
    },
    processor: json.processors['.json'],
    rules: {
      'json/*': ['error', 'allowComments'],
    },
  },
];
