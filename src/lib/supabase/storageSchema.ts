import { sql } from "drizzle-orm";
import { foreignKey, jsonb, pgSchema, primaryKey, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const storage = pgSchema('storage');
export const storageObjects = storage.table(
    "objects", 
    {
        id: uuid('id').primaryKey(),
        bucketId: text('bucket_id'),
        name: text('name'),
        owner: uuid('owner'),
        createdAt: timestamp('created_at', { withTimezone: true }).default(sql`now()`),
        updatedAt: timestamp('updated_at', { withTimezone: true }).default(sql`now()`),
        lastAccessedAt: timestamp('last_accessed_at', { withTimezone: true }).default(sql`now()`),
        metadata: jsonb('metadata'),
        pathTokens: text('path_tokens').array().generatedAlwaysAs(sql`string_to_array(name, '/'::text)`),
        version: text('version'),
        ownerId: text('owner_id'),
        userMetadata: jsonb('user_metadata'),
    }
);