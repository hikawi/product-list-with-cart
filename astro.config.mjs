// @ts-check
import { defineConfig } from "astro/config";

import solidJs from "@astrojs/solid-js";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel/serverless";

import vue from "@astrojs/vue";

// https://astro.build/config
export default defineConfig({
  integrations: [solidJs(), tailwind({ applyBaseStyles: false }), vue()],
  output: "server",
  adapter: vercel(),
});