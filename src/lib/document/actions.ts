'use server'

import { eq } from "drizzle-orm"
import { db } from "../db"
import { documentTable, pageTable } from "../db/schema"
import supabase from "../supabase/client"
import { throwOnError } from "../supabase/utils"

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


interface AddDocumentOptions {
    name: string, 
    pages: File[]
}

export async function addDocument(options: AddDocumentOptions){
    const [ document ] = await db
        .insert(documentTable)
        .values({ name: options.name })
        .returning({ id: documentTable.id });
    
    const pages = await Promise.all(options.pages.map(page => supabase.storage
        .from('documents')
        .upload(
            crypto.randomUUID(), 
            page, 
            { upsert: true }
        )
        .then(throwOnError)
    ));

    await db
        .insert(pageTable)
        .values(pages.map((page, index) => ({
            page: index,
            storagePath: page.path,
            documentId: document?.id!
        })))
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
}