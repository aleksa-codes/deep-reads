import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { user } from './auth';

export const favorites = sqliteTable('favorites', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  // Assuming the ID from `astro:content` collection is a string
  readId: text('read_id').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
});
