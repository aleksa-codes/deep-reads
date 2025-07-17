// src/lib/db.ts
// import { drizzle } from 'drizzle-orm/libsql';
// import { createClient } from '@libsql/client';
import { d1HttpDriver } from '@/lib/d1-http-driver';
import { drizzle as drizzleProxy } from 'drizzle-orm/sqlite-proxy';

// Create a client that connects to a local file
// const localClient = createClient({
//   url: 'file:./sqlite.db',
// });

// export const db = import.meta.env.PROD ? drizzle(localClient) : drizzleProxy(d1HttpDriver);

// export const db = process.env.NODE_ENV === 'production' ? drizzleProxy(d1HttpDriver) : drizzle(localClient);

// prod:
export const db = drizzleProxy(d1HttpDriver);

// dev:
// export const db = drizzle(localClient);
