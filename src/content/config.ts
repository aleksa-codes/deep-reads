import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { siteConfig } from '@/config/site.config';

const reads = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/reads' }),
  schema: () =>
    z.object({
      title: z.string(),
      url: z.string().url(),
      summary: z.string().optional(),
      tags: z.array(z.string()).default([]),
      dateAdded: z.coerce.date(),
    }),
});

export const collections = { reads };
