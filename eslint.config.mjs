// @ts-check

import eslint from "@eslint/js";
import typescriptEslint from "typescript-eslint";
import pluginReactRefresh from "eslint-plugin-react-refresh";
import { FlatCompat } from "@eslint/eslintrc";
import pluginReact from "eslint-plugin-react";
import globals from "globals";

const compat = new FlatCompat();
const files = ["**/*.ts", "**/*.tsx"];

export default [
  eslint.configs.recommended,
  ...typescriptEslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  pluginReact.configs.flat["jsx-runtime"],
  pluginReactRefresh.configs.recommended,
  ...compat.extends("plugin:react-hooks/recommended"),
  {
    rules: {
      "react/display-name": "off",
      "react/react-in-jsx-scope": "off",
      "@typescript-eslint/array-type": "error",
      "@typescript-eslint/consistent-type-imports": "error",
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "@typescript-eslint/ban-ts-comment": "off",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    languageOptions: {
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
      },
    },
  },
].map((conf) => ({
  ...conf,
  files,
}));
