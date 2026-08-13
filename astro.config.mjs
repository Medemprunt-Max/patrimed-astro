import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
    output: 'static',
    integrations: [tailwind(), sitemap({ filter: (page) => !page.includes('/avis') })],
    site: 'https://patrimed.fr',
    trailingSlash: 'never',
});
