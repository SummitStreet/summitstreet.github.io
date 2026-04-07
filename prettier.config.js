/** @type {import("prettier").Config} */
const config = {
  semi: true,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "es5",
  printWidth: 80,
  bracketSameLine: true,
  overrides: [
    {
      files: "*.html",
      options: {
        // Setting an extremely high printWidth prevents line wrapping
        printWidth: 1024,
        htmlWhitespaceSensitivity: "ignore",
      },
    },
    {
      files: "*.css",
      options: {},
    },
  ],
};

export default config;
