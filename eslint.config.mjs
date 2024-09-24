import eslint from '@antfu/eslint-config'

// Run `npx eslint-flat-config-viewer@latest` to view all rules.
export default eslint({
  unocss: true,
  rules: {
    'style/brace-style': ['error', '1tbs', {
      allowSingleLine: false,
    }],
    'curly': ['error', 'all'],
    'style/arrow-parens': ['error', 'as-needed', {
      requireForBlockBody: false,
    }],
    'antfu/top-level-function': 'off',
    'style/multiline-ternary': 'off',
    'no-console': 'off',

    // react
    'style/jsx-one-expression-per-line': 'off',
    'style/jsx-closing-tag-location': 'off',
  },
})
