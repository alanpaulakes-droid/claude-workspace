import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";

export default tseslint.config(
  { ignores: ["dist/**", "node_modules/**", "src/app/**", "src/vendor/**"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  { files: ["scripts/**/*.mjs"], languageOptions: { globals: { ...globals.node } } },
  { files: ["src/pwa/**/*.js"], languageOptions: { globals: { ...globals.serviceworker } } },
  { files: ["tests/e2e/**/*.mjs"], languageOptions: { globals: { ...globals.node, ...globals.browser, RICEngine: "readonly" } } },
);
