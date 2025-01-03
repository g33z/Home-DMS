'use server'

import { and, eq, inArray } from "drizzle-orm"
import { db } from "../db"
import { documentTable, documentToTagTable, pageTable, tagTable } from "../db/schema"
import supabase from "../supabase/client"
import { throwOnError } from "../supabase/utils"
import { CHANNEL, DOCUMENT } from "../supabase/realtime"

export interface DocumentPreview {
    id: number,
    tags: string[],
    thumbnail: string
}

export interface DocumentDetails {
    id: number,
    tags: string[],
    pages: string[]
}

export async function getDocumentPreviews(): Promise<DocumentPreview[]> {
    const documents = await db.query.documentTable.findMany({
        with: {
            pages: true,
            documentsToTag: {
                with: {
                    tag: true
                }
            }
        }
    })

    if(documents.length < 1) return [];

    const urls = await supabase.storage
        .from('documents')
        .createSignedUrls(documents.map(d => d.pages[0]?.storagePath!), 60 * 60 * 24)
        .then(throwOnError)
        .then(urls => {
            if(urls.every(url => url.error === null)) return urls;

            throw new Error(
                'One or more Error while fetching signedUrls', 
                { cause: urls
                    .filter(url => url.error)
                    .map(url => url.error)
                }
            );
        })
    
    return documents.map(document => ({
        id: document.id,
        tags: document.documentsToTag.map(r => r.tag.keyword),
        thumbnail: urls
            .find(u => u.path === document.pages[0]?.storagePath)!
            .signedUrl
    }));
}


export async function getDocumentPreview(id: number): Promise<DocumentPreview | undefined> {
    const document = await db.query.documentTable.findFirst({
        where: eq(documentTable.id, id),
        with: {
            pages: true,
            documentsToTag: {
                with: {
                    tag: {
                        columns: {
                            keyword: true
                        }
                    }
                }
            }
        }
    })

    if(document === undefined) return undefined;

    return {
        id: document.id,
        tags: document.documentsToTag.map(r => r.tag.keyword),
        thumbnail: await supabase.storage
            .from('documents')
            .createSignedUrl(document.pages[0]!.storagePath, 60 * 60 * 24)
            .then(throwOnError)
            .then(u => u.signedUrl)
    }
}


export async function getDocumentDetails(id: number): Promise<DocumentDetails | undefined> {
    const document = await db.query.documentTable.findFirst({
        where: eq(documentTable.id, id),
        with: {
            pages: true,
            documentsToTag: {
                with: {
                    tag: {
                        columns: {
                            keyword: true
                        }
                    }
                }
            }
        }
    })

    if(document === undefined) return undefined;

    const urls = await supabase.storage
        .from('documents')
        .createSignedUrls(document.pages.map(p => p.storagePath), 60)
        .then(throwOnError)
        .then(urls => {
            if(urls.every(url => url.error === null)) return urls;

            throw new Error(
                'One or more Error while fetching signedUrls', 
                { cause: urls
                    .filter(url => url.error)
                    .map(url => url.error)
                }
            );
        })

    return {
        id: document.id,
        tags: document.documentsToTag.map(r => r.tag.keyword),
        pages: document.pages
            .sort((a, b) => a.page - b.page)
            .map(page => urls
                .find(url => url.path === page.storagePath)!
                .signedUrl
            )
    }
}


export async function addDocument(options: {
    tags: string[], 
    pagePaths: string[]
}){
    const [ document ] = await db
        .insert(documentTable)
        .values({})
        .returning({ id: documentTable.id });

    await db
        .insert(pageTable)
        .values(options.pagePaths.map((path, index) => ({
            page: index,
            storagePath: path,
            documentId: document!.id
        })))

    await db
        .insert(tagTable)
        .values(options.tags.map(t => ({ keyword: t })))

    await db
        .insert(documentToTagTable)
        .values(options.tags.map(tag => ({
            documentId: document!.id,
            tag
        })))

    await supabase.realtime.channel(CHANNEL.DOCUMENT).send({
        type: 'broadcast',
        event: DOCUMENT.NEW,
        payload: { id: document!.id }
    })
}


export async function removeDocument(id: number){
    await db
        .delete(documentToTagTable)
        .where(eq(documentToTagTable.documentId, id))

    const pages = await db
        .delete(pageTable)
        .where(eq(pageTable.documentId, id))
        .returning({ path: pageTable.storagePath });

    await supabase.storage
        .from('documents')
        .remove(pages.map(p => p.path));

    await db
        .delete(documentTable)
        .where(eq(documentTable.id, id));

    await supabase.realtime.channel(CHANNEL.DOCUMENT).send({
        type: 'broadcast',
        event: DOCUMENT.DELETE,
        payload: { id }
    })
}


async function updateTags(document: DocumentDetails, tags: string[]){
    const addedTags = tags.filter(t => !document.tags.includes(t))
    const removedTags = document.tags.filter(t => !tags.includes(t))

    if(addedTags.length > 0){
        await db
            .insert(tagTable)
            .values(addedTags.map(t => ({ keyword: t })))
            .onConflictDoNothing()
    }

    if(removedTags.length > 0){
        await db
            .delete(documentToTagTable)
            .where(and(
                eq(documentToTagTable.documentId, document.id),
                inArray(documentToTagTable.tag, removedTags)
            ));
    }
}

export interface UpdateDocumentOptions {
    tags?: string[],
    pages?: string[]
}

export async function updateDocument(documentId: number, { tags, pages }: UpdateDocumentOptions) {
    const document = await getDocumentDetails(documentId)

    if(!document) throw new Error(`Document with id ${documentId} does not exist.`)

    if(tags){
        updateTags(document, tags)
    }

    if(pages){
        // TODO
    }
}