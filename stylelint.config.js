/** @type {import("stylelint").Config} */
export default {
  customSyntax: "postcss-html",
  extends: ["stylelint-config-standard", "stylelint-prettier/recommended"],
  rules: {
    "selector-class-pattern": null,
    "no-descending-specificity": null,
    "declaration-empty-line-before": "never",
  },
};
