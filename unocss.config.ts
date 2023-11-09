// $ npm i -D unocss @unocss/preset-mini @unocss/reset @unocss/transformer-variant-group animated-unocss
// uno.config.ts
import { defineConfig } from "unocss";
import transformerVariantGroup from "@unocss/transformer-variant-group";
import presetMini from "@unocss/preset-mini";
import { variantParentMatcher } from "@unocss/preset-mini/utils";
// import { animatedUno } from "animated-unocss";

export default defineConfig({
  content: {
    filesystem: ["src/**/*.{ts,tsx}"],
  },
  shortcuts: {},
  rules: [
    ["w-fit", { width: "fit-content" }],
    ["h-fit", { height: "fit-content" }],
    ["w-min", { width: "min-content" }],
    ["h-min", { height: "min-content" }],
    ["w-max", { width: "max-content" }],
    ["h-max", { height: "max-content" }],

    ["invert", { filter: "invert(1)" }],
  ],
  theme: {
    breakpoints: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
    },
  },
  variants: [
    variantParentMatcher("height", "@media (max-height: 500px)"),
    variantParentMatcher("lt-height", "@media (min-height: 500px)"),
  ],
  transformers: [transformerVariantGroup()],
  presets: [
    presetMini({
      dark: "media",
    }),
    // animatedUno(),
  ],
});
