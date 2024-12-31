'use server'

import { eq, inArray } from "drizzle-orm"
import { db } from "../db"
import { documentTable, documentToTagTable, pageTable, tagTable } from "../db/schema"
import supabase from "../supabase/client"
import { throwOnError } from "../supabase/utils"
import { CHANNEL, DOCUMENT } from "../supabase/realtime"

export interface DocumentPreview {
    id: number,
    tagKeywords: string[],
    thumbnail: string
}

export interface DocumentDetails {
    id: number,
    tags: {
        id: number,
        keyword: string
    }[],
    pages: string[]
}

export async function getDocumentPreviews(): Promise<DocumentPreview[]> {
    const documents = await db.query.documentTable.findMany({
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

    if(documents.length < 1) return [];

    const urls = await supabase.storage
        .from('documents')
        .createSignedUrls(documents.map(d => d.pages[0]?.storagePath!), 60)
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
        tagKeywords: document.documentsToTag.map(({ tag }) => tag.keyword),
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
        tagKeywords: document.documentsToTag.map(({ tag }) => tag.keyword),
        thumbnail: await supabase.storage
            .from('documents')
            .createSignedUrl(document.pages[0]!.storagePath, 60)
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
        tags: document.documentsToTag.map(relation => ({
            id: relation.tagId,
            keyword: relation.tag.keyword
        })),
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

    const tagIds = await db
        .insert(tagTable)
        .values(options.tags.map(t => ({ keyword: t })))
        .returning({ id: tagTable.id })

    await db
        .insert(documentToTagTable)
        .values(tagIds.map(({ id }) => ({
            documentId: document!.id,
            tagId: id
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