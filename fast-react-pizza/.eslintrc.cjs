// .eslintrc.cjs
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  settings: { react: { version: "18.2" } },
  plugins: ["react-refresh"],
  rules: {
    // ↓ turn off “unused vars” checking entirely
    "no-unused-vars": "off",

    // or just warn instead of error:
    // 'no-unused-vars': ['warn', { args: 'none', ignoreRestSiblings: true }],

    "react-refresh/only-export-components": "off",
  },
};
