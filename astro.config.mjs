/// <reference types="vitest" />

// @ts-check
import { defineConfig } from "astro/config";

import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel/serverless";
import vue from "@astrojs/vue";

import { codecovVitePlugin } from "@codecov/vite-plugin";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind({ applyBaseStyles: false }), vue()],
  output: "server",
  adapter: vercel({ imageService: true }),
  vite: {
    plugins: [
      codecovVitePlugin({
        enableBundleAnalysis: process.env.CODECOV_TOKEN !== undefined,
        bundleName: "product-list-with-cart",
        uploadToken: process.env.CODECOV_TOKEN,
      }),
    ],
  },
  site: "https://product-list-with-cart.frilly.dev/",
});
