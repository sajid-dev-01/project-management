import { builtinModules } from "module";

import eslint from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import prettierRecommended from "eslint-plugin-prettier/recommended";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import tailwind from "eslint-plugin-tailwindcss";
import unusedImports from "eslint-plugin-unused-imports";
import globals from "globals";
import tslint from "typescript-eslint";

export default [
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  { ignores: ["**/node_modules", "**/dist", "**/.next", "**/.git"] },

  eslint.configs.recommended,
  ...tslint.configs.recommended,
  ...tailwind.configs["flat/recommended"],
  prettierRecommended,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      ecmaVersion: "latest",
      parser: tsParser,
    },
  },
  {
    plugins: { react, "react-hooks": reactHooks },
    rules: {
      "react-hooks/rules-of-hooks": "warn",
      "react/no-unescaped-entities": "warn",
    },
  },
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
      "unused-imports": unusedImports,
    },
    rules: {
      "simple-import-sort/imports": [
        2,
        {
          groups: [
            [`^(${builtinModules.join("|")})(/|$)`],
            ["server-only"],
            [
              // '^react',
              "^@?\\w",
            ],
            ["^@/\\w"],
            ["^components(/.*|$)"],
            ["^\\."],
            ["^.+\\.s?css$"],
          ],
        },
      ],
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    rules: {
      "@typescript-eslint/no-var-requires": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/ban-types": "off",
      "no-empty-pattern": "off",
      "tailwindcss/no-custom-classname": "off",
      "tailwindcss/enforces-negative-arbitrary-values": "off",
      // "sort-imports": "off",
      "prettier/prettier": [
        "error",
        {
          endOfLine: "auto",
          semi: true,
          singleQuote: false,
          jsxSingleQuote: false,
          trailingComma: "es5",
          tabWidth: 2,
        },
      ],
    },
    settings: {
      tailwindcss: {
        callees: ["cn"],
        config: "tailwind.config.js",
      },
    },
  },
];
