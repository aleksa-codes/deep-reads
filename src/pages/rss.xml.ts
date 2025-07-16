import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { siteConfig } from '@/config/site.config';

export async function GET() {
  const reads = await getCollection('reads');
  const sortedReads = reads.sort((a, b) => b.data.dateAdded.valueOf() - a.data.dateAdded.valueOf());

  return rss({
    title: siteConfig.title,
    description: `The latest articles from ${siteConfig.title}`,
    site: import.meta.env.SITE,
    items: sortedReads.map((post) => ({
      title: post.data.title,
      pubDate: post.data.dateAdded,
      description: post.data.summary ?? '',
      link: post.data.url,
    })),
    customData: `<language>${siteConfig.defaultLocale.toLowerCase()}</language>`,
    stylesheet: '/rss/styles.xsl',
  });
}
