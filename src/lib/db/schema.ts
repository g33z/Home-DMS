import { bigint, bigserial, integer, pgTable, primaryKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { text } from "drizzle-orm/pg-core";


export const documentTable = pgTable('documents', {
	id: bigserial({ mode: "number" }).primaryKey()
})

export const tagTable = pgTable('tags', {
	keyword: text().primaryKey()
})

export const documentToTagTable = pgTable('documentToTag', 
	{
		documentId: bigint({ mode: "number" }).references(() => documentTable.id).notNull(),
		tag: text().references(() => tagTable.keyword).notNull()
	}, 
	(t) => ([
		primaryKey({ columns: [t.documentId, t.tag] }) 
	])
);

export const pageTable = pgTable('documentPages', {
	storagePath: text().primaryKey(),
	documentId: bigint({ mode: "number" }).references(() => documentTable.id).notNull(),
	page: integer().notNull()
})


export const documentRelations = relations(documentTable, ({ many }) => ({
	pages: many(pageTable),
	documentsToTag: many(documentToTagTable)
}))

export const pageRelations = relations(pageTable, ({ one }) => ({
	document: one(documentTable, {
		fields: [pageTable.documentId],
		references: [documentTable.id]
	})
}))

export const tagRelations = relations(tagTable, ({ many }) => ({
	tagToDocuments: many(documentToTagTable)
}))

export const documentToTagRelations = relations(documentToTagTable, ({ one }) => ({
	document: one(documentTable, {
		fields: [documentToTagTable.documentId],
		references: [documentTable.id]
	}),
	tag: one(tagTable, {
		fields: [documentToTagTable.tag],
		references: [tagTable.keyword]
	})
}))