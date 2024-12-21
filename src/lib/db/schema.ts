import { bigint, bigserial, integer, pgTable, varchar } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { jsonb, pgSchema, text, timestamp, uuid } from "drizzle-orm/pg-core";


// supabase internal schema for storage objectss
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

export const documentTable = pgTable('documents', {
	id: bigserial({ mode: "number" }).primaryKey(),
	name: text().notNull()
})

export const pageTable = pgTable('documentPages', {
	storagePath: text().primaryKey(),
	documentId: bigint({ mode: "number" }).references(() => documentTable.id).notNull(),
	page: integer().notNull()
})

export const documentRelations = relations(documentTable, ({ many }) => ({
	pages: many(pageTable)
}))

export const pageRelations = relations(pageTable, ({ one }) => ({
	document: one(documentTable, {
		fields: [pageTable.documentId],
		references: [documentTable.id]
	})
}))