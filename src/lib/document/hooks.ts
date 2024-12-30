import { useEffect, useState } from "react"
import { DocumentPreview, getDocumentPreview } from "./actions"
import { CHANNEL, DOCUMENT } from "../supabase/realtime"
import supabase from "../supabase/client"


export function useDocuments(prefetchedDocs: DocumentPreview[]){
    const [documents, setDocuments] = useState<DocumentPreview[]>(prefetchedDocs);

    useEffect(() => {
        const channel = supabase
            .channel(CHANNEL.DOCUMENT)
            .on('broadcast', { event: DOCUMENT.NEW }, ({ payload }) => {
                    return getDocumentPreview(payload.id)
                    .then(newDoc => { 
                        if(newDoc === undefined) throw new Error(`Received new document event but ${payload.id} doesn't exist`);
                        return newDoc
                    })
                    .then(newDoc => setDocuments(oldDocs => [
                        ...oldDocs,
                        newDoc
                    ]))
                }
            )
            .on('broadcast', { event: DOCUMENT.DELETE }, ({ payload }) => setDocuments(docs => 
                docs.filter(doc => doc.id !== payload.id)
            ))
            .subscribe()

        return () => { channel.unsubscribe() }
    }, []);

    return documents;
}