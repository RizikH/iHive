import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Allow unused variables
      "@typescript-eslint/no-unused-vars": "off", // Disable unused vars rule

      // Allow any types
      "@typescript-eslint/no-explicit-any": "off", // Allow `any` type usage

      // Disable no unescaped entities in JSX
      "react/no-unescaped-entities": "off", // Allow unescaped entities in JSX

      // Disable exhaustive-deps warnings in useEffect
      "react-hooks/exhaustive-deps": "warn", // Warn for missing deps, but not errors

      // Disable warnings for empty interfaces
      "@typescript-eslint/no-empty-interface": "off", // Allow empty interfaces
    },
  },
];

export default eslintConfig;
