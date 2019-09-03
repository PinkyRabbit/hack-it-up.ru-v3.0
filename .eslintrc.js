module.exports = {
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2018,
  },
  env: {
    node: true,
  },
  rules: {
    "no-underscore-dangle": "off",
    "comma-dangle": ["error", "always-multiline"],
    "no-multi-spaces": ["error", { "exceptions": { "VariableDeclarator": true } }],
    "no-use-before-define": ["error", { "functions": false, "classes": true }],
    "newline-per-chained-call": "off"
  }
};
