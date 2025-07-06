const js = require('@eslint/js');

module.exports = [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: {
        console: true,
        process: true,
        __dirname: true,
        module: true,
        require: true
      }
    },
    rules: {}
  },
  {
    files: ['**/*.test.js', 'jest.setup.js'],
    languageOptions: {
      sourceType: 'module',
      globals: {
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        beforeEach: 'readonly',
        jest: 'readonly'
      }
    }
  }
];