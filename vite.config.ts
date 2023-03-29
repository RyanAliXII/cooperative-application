import { sveltekit } from "@sveltejs/kit/vite";
import Terminal from "vite-plugin-terminal";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    sveltekit(),
    Terminal({
      console: "terminal",
    }),
  ],
});
