import { defineConfig } from "vitest/config";
import path from "path";

// Unit tests for pure logic (no app server or DB). Per-file environment can be
// overridden with a `// @vitest-environment jsdom` docblock (used by DOM tests).
export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
});
