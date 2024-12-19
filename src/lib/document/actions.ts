'use server'

import { ne } from "drizzle-orm"
import { db } from "../db"
import supabase from "../supabase/client"
import { throwOnError } from "../supabase/utils"

export async function getDocuments() {
    const documents = await db.query.storageObjects.findMany({
        columns: {
            id: true,
            userMetadata: true,
            name: true
        },
        where: (objects, { ne }) => ne(objects.name, '.emptyFolderPlaceholder')
    })

    if(documents.length < 1) return [];

    const urls = await supabase.storage
        .from('documents')
        .createSignedUrls(documents.map(d => d.name!), 60)
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
        name: (document.userMetadata as Record<string, string>).name!,
        path: document.name!,
        url: urls.find(({path}) => path === document.name)?.signedUrl!
    }))
}