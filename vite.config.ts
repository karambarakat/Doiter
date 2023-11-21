import { defineConfig } from "vite";
import { qwikVite } from "@builder.io/qwik/optimizer";
import { qwikCity } from "@builder.io/qwik-city/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import UnoCSS from "unocss/vite";
import { VitePWA } from  'vite-plugin-pwa'

export default defineConfig(() => {
  return {
    plugins: [qwikCity(), qwikVite(), tsconfigPaths(), UnoCSS()],

    preview: {
      headers: {
        "Cache-Control": "public, max-age=600",
      },
    },
  };
});
