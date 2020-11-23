module.exports = {
  parser: 'vue-eslint-parser',
  extends: [
    'plugin:vue/essential',
    'stable',
    'stable/typescript',
  ],
  parserOptions: {
    extraFileExtensions: ['.vue'],
    parser: '@typescript-eslint/parser',
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
}
