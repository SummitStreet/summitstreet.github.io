import globals from "globals";
import html from "@html-eslint/eslint-plugin";
import htmlParser from "@html-eslint/parser";
import js from "@eslint/js";
import jsdoc from "eslint-plugin-jsdoc";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: ["node_modules/**", "dist/**"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  jsdoc.configs["flat/contents-typescript-error"],
  {
    ignores: ["**/*.html"],
  },
  {
    files: ["src/**/*.ts", "test/**/*.ts"],
    languageOptions: {
      parser: tseslint.parser,
      globals: { ...globals.node, ...globals.jest },
    },
    plugins: { jsdoc, "simple-import-sort": simpleImportSort },
    rules: {
      "jsdoc/require-description": "error",
      "jsdoc/text-escaping": "off",
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
  },
  {
    files: ["**/*.html"],
    plugins: { html },
    languageOptions: {
      parser: htmlParser,
      globals: globals.browser,
    },
    rules: {
      ...html.configs.recommended.rules,
      "html/indent": ["error", 2],
      "html/require-lang": "error",
      "no-unused-vars": "warn",
      "no-undef": "error",
      "no-console": ["warn", { allow: ["error", "warn"] }],
    },
  },
];
