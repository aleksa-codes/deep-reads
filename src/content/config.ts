import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Define the schema for a single "read"
const reads = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/reads' }),
  schema: () =>
    z.object({
      title: z.string(),
      url: z.string().url(),
      summary: z.string().optional(),
      // 'tags' now stores an array of slugs (strings) which are foreign keys to the 'tags' collection
      tags: z.array(z.string()).default([]),
      dateAdded: z.coerce.date(),
    }),
});

// Define the new schema for a single "tag"
const tags = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/tags' }),
  schema: z.object({
    title: z.string(), // The human-readable display name of the tag
  }),
});

// Export both collections for Astro to use
export const collections = { reads, tags };
