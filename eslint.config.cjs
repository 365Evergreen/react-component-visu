module.exports = [
  {
    ignores: ['assets/**', 'dist/**', 'node_modules/**'],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        ecmaFeatures: { jsx: true }
      },
      globals: {
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        process: 'readonly'
      }
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'off'
    }
  }
];
