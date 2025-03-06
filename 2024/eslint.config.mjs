import globals from 'globals';
import pluginJs from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';

/** @type {import('eslint').Linter.Config[]} */
const config = [
  {files: [ '**/*.js' ], languageOptions: {sourceType: 'commonjs'}},
  {languageOptions: { globals: globals.node }},
  pluginJs.configs.recommended,
  {
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      indent: [
        'error',
        2,
        {
          'MemberExpression': 1,
          'SwitchCase': 1
        }
      ],
      semi: 'error',
      eqeqeq: [ 'error', 'always' ],
      quotes: [ 'error', 'single' ],
      'no-octal': [ 'off' ],
      'no-multiple-empty-lines': [ 'error', { 'max': 1, 'maxBOF': 1 }],
      'no-unused-vars': [ 'warn' ],
      'no-fallthrough': [ 'off' ],
      '@stylistic/array-bracket-spacing': [ 'error', 'always', { 'objectsInArrays': false, 'arraysInArrays': false }],
      '@stylistic/eol-last': [ 'error', 'always' ]
    },
  },
];

export default config;
