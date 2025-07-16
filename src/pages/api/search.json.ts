// src/pages/api/search.json.ts
import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

// Export the type so other files can use it
export interface ReadItem {
  id: string;
  title: string;
  summary: string;
  tags: string[];
}

export const GET: APIRoute = async ({}) => {
  const reads = await getCollection('reads');

  const searchData: ReadItem[] = reads.map((read) => ({
    id: read.id,
    title: read.data.title,
    summary: read.data.summary ?? '',
    tags: read.data.tags,
  }));

  return new Response(JSON.stringify(searchData), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
