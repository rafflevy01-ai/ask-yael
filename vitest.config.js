import { defineConfig } from "vitest/config";
import path from "node:path";

// Vitest configuration for the Ask-Yael conversation engine.
// The engine lives under src/engine and is framework-agnostic (no DOM required),
// so we run it in the fast default "node" environment.
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "src"),
    },
  },
  test: {
    environment: "node",
    include: ["src/engine/**/*.test.js"],
    globals: false,
  },
});
