// src/pages/api/favorites/status.ts
import type { APIRoute } from 'astro';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { favorites } from '@/lib/schema';
import { and, eq } from 'drizzle-orm';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const session = await auth.api.getSession({ headers: request.headers });

  const url = new URL(request.url);
  const readId = url.searchParams.get('readId');

  if (!readId) {
    return new Response('readId is required', { status: 400 });
  }

  // If there's no user, they can't have any favorites.
  if (!session?.user) {
    return new Response(JSON.stringify({ isFavorited: false }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const result = await db
      .select({ count: favorites.readId })
      .from(favorites)
      .where(and(eq(favorites.userId, session.user.id), eq(favorites.readId, readId)))
      .limit(1);

    const isFavorited = result.length > 0;

    return new Response(JSON.stringify({ isFavorited }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Failed to get favorite status:', error);
    return new Response('Failed to get favorite status', { status: 500 });
  }
};
