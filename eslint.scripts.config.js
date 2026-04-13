import globals from "globals";
import js from "@eslint/js";
import eslintPluginHtml from "eslint-plugin-html";

export default [
  {
    ignores: ["node_modules/**", "dist/**"],
  },
  {
    files: ["**/*.html"],
    plugins: { html: eslintPluginHtml },
    settings: {
      "html/html-extensions": [".html"],
      "html/indent": "+2",
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser,
    },
    rules: {
      ...js.configs.recommended.rules,
      "no-unused-vars": "warn",
      "no-undef": "error",
      "no-console": ["warn", { allow: ["error", "warn"] }],
    },
  },
];
