import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import alpinejs from "@astrojs/alpinejs";
import { i18n, filterSitemapByDefaultLocale } from "astro-i18n-aut/integration";
import { DEFAULT_LOCALE, LOCALES, SITE_URL } from "./src/consts";
import sveltiaCMS from "astro-sveltia-cms";
import node from "@astrojs/node";
import embeds from 'astro-embed/integration';

const defaultLocale = DEFAULT_LOCALE;
const locales = LOCALES;

// https://astro.build/config
export default defineConfig({
  markdown: {
    shikiConfig: {
      // Choose from Shiki's built-in themes (or add your own)
      // https://github.com/shikijs/shiki/blob/main/docs/themes.md
      theme: "dracula",

      // Alternatively, provide multiple themes
      // https://shikiji.netlify.app/guide/dual-themes#light-dark-dual-themes
      // experimentalThemes: {
      //      dark: "github-dark",
      // 	light: "github-light",
      // },
      // Add custom languages
      // Note: Shiki has countless langs built-in, including .astro!
      // https://github.com/shikijs/shiki/blob/main/docs/languages.md
      langs: [],
      // Enable word wrap to prevent horizontal scrolling
      wrap: true,
    },
  },

  site: SITE_URL,
  output: "server",
  trailingSlash: "always",
  build: {
    format: "directory",
  },
  vite: {
    logLevel: "error",
    define: {
      __DATE__: `'${new Date()}'`,
    },
  },
  integrations: [
    embeds(),
    mdx(),
    sitemap({
      i18n: {
        locales,
        defaultLocale,
      },
      filter: filterSitemapByDefaultLocale({
        defaultLocale,
      }),
    }),
    sveltiaCMS(),
    tailwind({
      applyBaseStyles: false,
    }),
    alpinejs(),
    i18n({
      locales,
      defaultLocale,
      exclude: ["pages/api/**/*", "pages/rss.xml.ts", "pages/[locale]/rss.xml.ts"],
    }),
  ],
  adapter: node({
    mode: "standalone",
  }),
});
