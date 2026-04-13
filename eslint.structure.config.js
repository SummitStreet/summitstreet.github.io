import html from "@html-eslint/eslint-plugin";
import htmlParser from "@html-eslint/parser";

export default [
  {
    ignores: ["node_modules/**", "dist/**"],
  },
  {
    files: ["**/*.html"],
    plugins: { html },
    languageOptions: {
      parser: htmlParser,
    },
    rules: {
      ...html.configs.recommended.rules,
      "html/indent": ["error", 2],
      "html/require-lang": "error",
      "html/attrs-newline": "off",
      "html/require-closing-tags": "off",
      "html/no-extra-spacing-attrs": "off",
    },
  },
];
