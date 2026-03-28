// drizzle.config.ts
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

const isProd = process.env.NODE_ENV === 'production';

export default defineConfig({
  out: './drizzle',
  schema: './src/lib/schema',
  dialect: 'sqlite',
  casing: 'snake_case',
  strict: true,
  verbose: true,
  ...(isProd
    ? {
        driver: 'd1-http',
        dbCredentials: {
          accountId: process.env.CLOUDFLARE_ACCOUNT_ID as string,
          databaseId: process.env.CLOUDFLARE_D1_DATABASE_ID as string,
          token: process.env.CLOUDFLARE_D1_TOKEN as string,
        },
      }
    : {
        dbCredentials: {
          url: 'file:./sqlite.db',
        },
      }),
});
