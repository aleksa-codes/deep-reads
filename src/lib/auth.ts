import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@/lib/db'; // your drizzle instance
import * as schema from '@/lib/schema'; // your schema file

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'sqlite', // or "mysql", "pg"
    schema: schema,
  }),
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache duration in seconds
    },
  },
  emailAndPassword: {
    enabled: false,
  },
  socialProviders: {
    github: {
      clientId: import.meta.env.GITHUB_CLIENT_ID as string,
      clientSecret: import.meta.env.GITHUB_CLIENT_SECRET as string,
    },
  },
});
