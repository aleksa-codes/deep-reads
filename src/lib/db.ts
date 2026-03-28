import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { drizzle as drizzleProxy } from 'drizzle-orm/sqlite-proxy';
import { d1HttpDriver } from './d1-http-driver';

function createDbClient() {
  // Use import.meta.env.PROD (Astro) or process.env.NODE_ENV (Node/Bun) to check environment
  const isProd = import.meta.env?.PROD || process.env.NODE_ENV === 'production';

  if (isProd) {
    console.log('Using Production D1 Database (HTTP Proxy)');
    return drizzleProxy(d1HttpDriver);
  }

  console.log('Using Local SQLite Database (LibSQL)');
  // Local development client
  const localClient = createClient({
    url: 'file:./sqlite.db',
  });
  return drizzle(localClient);
}

export const db = createDbClient();
