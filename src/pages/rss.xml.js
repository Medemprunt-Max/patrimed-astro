import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('blog');
  return rss({
    title: 'PatriActu — Patrimed',
    description:
      'Actualités, analyses et conseils patrimoniaux pour les professionnels de santé, par Patrimed, cabinet de gestion de patrimoine indépendant.',
    site: context.site,
    items: posts
      .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
      .map((post) => ({
        title: post.data.title,
        description: post.data.excerpt,
        pubDate: post.data.date,
        link: `/patriactu/${post.id}`,
        categories: post.data.tag ? [post.data.tag] : [],
      })),
    customData: '<language>fr-FR</language>',
  });
}
