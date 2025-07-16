// src/lib/db.ts
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { d1HttpDriver } from '@/lib/d1-http-driver';
import { drizzle as drizzleProxy } from 'drizzle-orm/sqlite-proxy';

// Create a client that connects to a local file
const localClient = createClient({
  url: 'file:./sqlite.db', // This tells it to create/use a file named sqlite.db in your project root
});

// export const db = import.meta.env.PROD ? drizzle(localClient) : drizzleProxy(d1HttpDriver);

export const db = process.env.NODE_ENV === 'production' ? drizzleProxy(d1HttpDriver) : drizzle(localClient);
