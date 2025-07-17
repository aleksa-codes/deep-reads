// src/pages/api/favorites/add.ts
import type { APIRoute } from 'astro';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { favorites } from '@/lib/schema';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const session = await auth.api.getSession({ headers: request.headers });
  console.log('headers', request.headers);
  if (!session?.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const { readId } = await request.json();
    if (!readId || typeof readId !== 'string') {
      return new Response('Invalid readId', { status: 400 });
    }

    await db.insert(favorites).values({
      id: crypto.randomUUID(),
      userId: session.user.id,
      readId: readId,
    });

    return new Response('Favorite added', { status: 200 });
  } catch (error) {
    // This will catch errors like trying to insert a duplicate favorite
    console.error('Failed to add favorite:', error);
    return new Response('Failed to add favorite', { status: 500 });
  }
};
