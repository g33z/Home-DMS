import { useEffect, useState } from "react"
import { getDocumentPreview } from "./actions"
import { CHANNEL, DOCUMENT } from "../supabase/realtime"
import supabase from "../supabase/client"

export interface DocumentSource {
    id: number
    name: string
    thumbnail: string
}

export function useDocuments(documents: DocumentSource[]){
    const [documentUrls, setDocumentUrls] = useState<DocumentSource[]>(documents);

    useEffect(() => {
        const channel = supabase
            .channel(CHANNEL.DOCUMENT)
            .on('broadcast', { event: DOCUMENT.NEW }, ({ payload }) => {
                    return getDocumentPreview(payload.id)
                    .then(newDoc => { 
                        if(newDoc === undefined) throw new Error(`Received new document event but ${payload.id} doesn't exist`);
                        return newDoc
                    })
                    .then(newDoc => setDocumentUrls(oldDocs => [
                        ...oldDocs,
                        newDoc
                    ]))
                }
            )
            .on('broadcast', { event: DOCUMENT.DELETE }, ({ payload }) => setDocumentUrls(docs => 
                docs.filter(doc => doc.id !== payload.id)
            ))
            .subscribe()

        return () => { channel.unsubscribe() }
    }, []);

    return documentUrls;
}