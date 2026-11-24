import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Logic tests only (no browser). Run with: npm test
export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL(".", import.meta.url)) },
  },
  test: {
    environment: "node",
    include: ["lib/**/*.test.ts", "tests/**/*.test.ts"],
  },
});
