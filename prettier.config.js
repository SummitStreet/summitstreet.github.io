/** @type {import("prettier").Config} */
const config = {
  semi: true,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "es5",
  printWidth: 80,
  bracketSameLine: false,
  overrides: [
    {
      files: "*.html",
      options: {
        printWidth: 1024,
        htmlWhitespaceSensitivity: "css",
      },
    },
  ],
};

export default config;
