import { useEffect, useState } from "react"
import { DocumentPreview, getDocumentPreview } from "./actions"
import { CHANNEL, DOCUMENT } from "../supabase/realtime"
import supabase from "../supabase/client"


function filterDocuments(documents: DocumentPreview[], search: string | undefined){
    if(!search) return documents

    return documents.filter(doc => 
        search.trim().toLowerCase().split(' ').every(query => 
            doc.tagKeywords.some(keyword => 
                keyword.toLowerCase() === query
            )
        )
    );
}


export function useDocuments(prefetchedDocs: DocumentPreview[], search?: string){
    const [documents, setDocuments] = useState<DocumentPreview[]>(prefetchedDocs);
    const [filteredDocuments, setFilteredDocuments] = useState(documents);

    useEffect(() => {
        setFilteredDocuments(filterDocuments(documents, search))
    }, [documents, search]);

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


    return filteredDocuments;
}