// vitest.config.ts
import { defineConfig } from "vitest/config";
import { fileURLToPath } from "url";
import { resolve } from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./tests/setupTests.ts"],
    include: ["tests/**/*.test.{ts,tsx}"],
    css: true,
  },
  resolve: {
    alias: {
      // Map "@" to the project root so "@/components/..." works in tests
      "@": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
});
