// @ts-check

import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";
import globals from "globals";

export default defineConfig(
  // 전역 무시 패턴
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "out/**",
      ".vite/**",
      "*.config.js",
      "*.config.ts",
    ],
  },

  // 기본 설정
  eslint.configs.recommended,
  tseslint.configs.recommended,

  // TypeScript 파일 설정
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
    rules: {
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-deprecated": "warn",
    },
  }
);
