import js from "@eslint/js";
import globals from "globals";
import html from "eslint-plugin-html";

export default [
  js.configs.recommended,
  {
    files: ["**/*.html"],
    plugins: { html },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    settings: {
      "html/html-extensions": [".html"],
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "error",
    },
  },
];
