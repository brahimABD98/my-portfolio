import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwind from "@astrojs/tailwind";
import vercel from '@astrojs/vercel/static';

import qwikdev from "@qwikdev/astro";

// https://astro.build/config
export default defineConfig({
  site: 'https://brahimabd.tech/',
  integrations: [sitemap(), tailwind(), qwikdev()],
  output: "static",
  adapter: vercel({
    webAnalytics: {
      enabled: true
    },
    speedInsights: {
      enabled: true
    },
    imageService: true
  })
});