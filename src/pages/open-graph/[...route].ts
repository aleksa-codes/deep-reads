import { getCollection } from 'astro:content';
import { OGImageRoute } from 'astro-og-canvas';

export const { getStaticPaths, GET } = OGImageRoute({
  param: 'route',

  pages: await getCollection('reads').then((posts) =>
    Object.fromEntries(
      posts.map((post) => [
        post.id,
        {
          title: post.data.title,
          description: post.data.summary ?? '',
          // thumbnail: post.data.thumbnail, // not present in schema
        },
      ]),
    ),
  ),
  getImageOptions: (_path, page) => ({
    title: page.title,
    description: page.description,
    logo: {
      path: './src/assets/tree-pine.png',
      size: [48],
    },
    font: {
      title: {
        size: 60,
        families: ['Inter'],
        weight: 'Bold',
      },
      description: {
        size: 30,
        families: ['Inter'],
        lineHeight: 1.4,
      },
    },
    fonts: [
      'https://api.fontsource.org/v1/fonts/inter/latin-400-normal.ttf',
      'https://api.fontsource.org/v1/fonts/inter/latin-700-normal.ttf',
    ],
    bgGradient: [
      [34, 197, 94],
      [16, 185, 129],
    ],
    border: {
      color: [34, 197, 94],
      width: 20,
      side: 'block-start',
    },
  }),
});
