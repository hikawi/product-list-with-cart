/// <reference types="vitest" />
import { getViteConfig } from 'astro/config';
import tsconfigPaths from "vite-tsconfig-paths";

export default getViteConfig({
  plugins: [tsconfigPaths()],
  build: {
    target: 'esnext',
  },
  resolve: {
    conditions: ['development', 'browser'],
  },
  test: {
    include: ["./tests/**/*.{test,spec}.?(c|m)[jt]s?(x)"],
    setupFiles: [
      "./tests/vitest-setup.ts",
      "node_modules/@testing-library/jest-dom/vitest",
    ],
    server: {
      deps: {
        inline: [/solid-js/],
      }
    },
    coverage: {
      provider: "istanbul",
      enabled: true,
      reporter: ["text", "json"],
    },
    environment: "jsdom",
  },
});
