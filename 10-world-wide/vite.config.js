import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    eslint({
      // runs `eslint --fix` on your files
      fix: true,
      // only lint + fix these globs
      include: ["src/**/*.js", "src/**/*.jsx", "src/**/*.ts", "src/**/*.tsx"],
      // optional: show warnings/errors in browser overlay
      emitWarning: true,
      emitError: true,
    }),
  ],
});
