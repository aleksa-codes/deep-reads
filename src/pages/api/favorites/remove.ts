// src/pages/api/favorites/remove.ts
import type { APIRoute } from 'astro';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { favorites } from '@/lib/schema';
import { and, eq } from 'drizzle-orm';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const { readId } = await request.json();
    if (!readId || typeof readId !== 'string') {
      return new Response('Invalid readId', { status: 400 });
    }

    await db.delete(favorites).where(and(eq(favorites.userId, session.user.id), eq(favorites.readId, readId)));

    return new Response('Favorite removed', { status: 200 });
  } catch (error) {
    console.error('Failed to remove favorite:', error);
    return new Response('Failed to remove favorite', { status: 500 });
  }
};
