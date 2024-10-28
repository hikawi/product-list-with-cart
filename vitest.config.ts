/// <reference types="vitest" />
import { getViteConfig } from "astro/config";

export default getViteConfig({
  test: {
    include: ["./tests/**/*.{test,spec}.?(c|m)[jt]s?(x)"],
    setupFiles: [
      "./tests/vitest-setup.ts",
    ],
    reporters: (process.env.CI ? [["github-actions"], ["default"], ["junit", { outputFile: "./test-results/results.xml" }]] : "verbose"),
    coverage: {
      provider: "istanbul",
      reporter: (process.env.CI ? "json" : "text"),
      exclude: ["./src/layouts/**", "./src/pages/**"],
      reportOnFailure: true,
    },
    environment: "jsdom",
  },
});
