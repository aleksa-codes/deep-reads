import { createAuthClient } from 'better-auth/react';
import { createAuthClient as createVanillaClient } from 'better-auth/client';

export const authClient = createAuthClient({
  baseURL: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : undefined,
});

export const { useSession: useVanillaSession } = createVanillaClient({
  baseURL: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : undefined,
});

export const { signIn, signOut, useSession } = authClient;

export type Session = typeof authClient.$Infer.Session;
export type User = typeof authClient.$Infer.Session.user;
