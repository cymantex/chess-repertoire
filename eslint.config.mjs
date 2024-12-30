// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import reactRefresh from "eslint-plugin-react-refresh";

const files = ["**/*.ts", "**/*.tsx"];

export default [
  ...[
    reactRefresh.configs.recommended,
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
  ].map((conf) => ({
    ...conf,
    files,
  })),
  {
    files,
    rules: {
      "@typescript-eslint/array-type": "error",
      "@typescript-eslint/consistent-type-imports": "error",
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "@typescript-eslint/ban-ts-comment": "off",
    },
  },
];
