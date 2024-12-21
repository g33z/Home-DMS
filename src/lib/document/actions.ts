'use server'

import { eq } from "drizzle-orm"
import { db } from "../db"
import { documentTable, pageTable } from "../db/schema"
import supabase from "../supabase/client"
import { throwOnError } from "../supabase/utils"
import { CHANNEL, DOCUMENT } from "../supabase/realtime"

export async function getDocuments() {
    const documents = await db.query.documentTable.findMany({
        with: {
            pages: true
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
        name: document.name,
        thumbnail: urls
            .find(u => u.path === document.pages[0]?.storagePath)!
            .signedUrl
    }));
}


export async function getDocumentPreview(id: number) {
    const document = await db.query.documentTable.findFirst({
        where: eq(documentTable.id, id),
        with: {
            pages: true
        }
    })

    if(document === undefined) return undefined;

    return {
        id: document.id,
        name: document.name,
        thumbnail: await supabase.storage
            .from('documents')
            .createSignedUrl(document.pages[0]!.storagePath, 60)
            .then(throwOnError)
            .then(u => u.signedUrl)
    }
}


export async function getDocumentDetails(id: number) {
    const document = await db.query.documentTable.findFirst({
        where: eq(documentTable.id, id),
        with: {
            pages: true
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
        name: document.name,
        pages: document.pages
            .sort((a, b) => a.page - b.page)
            .map(page => urls
                .find(url => url.path === page.storagePath)!
                .signedUrl
            )
    }
}


interface AddDocumentOptions {
    name: string, 
    pages: File[]
}

export async function addDocument(options: AddDocumentOptions){
    const pages = await Promise.all(options.pages.map(page => supabase.storage
        .from('documents')
        .upload(
            crypto.randomUUID(), 
            page, 
            { cacheControl: '31536000' }
        )
        .then(throwOnError)
    ));

    const [ document ] = await db
        .insert(documentTable)
        .values({ name: options.name })
        .returning({ id: documentTable.id });

    await db
        .insert(pageTable)
        .values(pages.map((page, index) => ({
            page: index,
            storagePath: page.path,
            documentId: document!.id
        })))

    await supabase.realtime.channel(CHANNEL.DOCUMENT).send({
        type: 'broadcast',
        event: DOCUMENT.NEW,
        payload: { id: document!.id }
    })
}


export async function removeDocument(id: number){
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