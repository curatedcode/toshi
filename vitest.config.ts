import path from "path";
import { defineConfig, defaultExclude } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    include: ["./tests/**"],
    exclude: [...defaultExclude, "./e2e/**", "./tests/vitest.setup.ts"],
    alias: {
      "~": path.resolve(__dirname, "./src"),
    },
    css: true,
    environment: "jsdom",
  },
});
