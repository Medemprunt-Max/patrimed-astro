import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
    output: 'static',
    integrations: [tailwind(), sitemap()],
    site: 'https://patrimed.fr',
    trailingSlash: 'never',
    // format 'file' (page.html) : Netlify sert alors /page sans slash ni
    // redirection, en cohérence avec trailingSlash 'never' et les canonicals.
    build: { format: 'file' },
});
