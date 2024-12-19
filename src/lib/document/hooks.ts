import { use, useEffect, useState } from "react"
import supabase from "../supabase/client"
import { getDocuments } from "./actions"

export function useDocumentsChange(onChange: () => void){
    useEffect(() => {
        const channel = supabase.channel('schema-db-changes')
        
        channel.on(
            'postgres_changes',
            {
                event: '*',
                schema: 'storage',
                table: 'objects'
            },
            onChange
        )
        .subscribe()

        return () => { channel.unsubscribe() }
    }, [])
}

export interface DocumentSource {
    id: string
    name: string
    url: string
    path: string
}

export function useDocuments(documents: Promise<DocumentSource[]>){
    const prefetchedDocuments = use(documents);
    const [documentUrls, setDocumentUrls] = useState<DocumentSource[]>(prefetchedDocuments);

    function getUrls(){
        getDocuments().then(setDocumentUrls)
    }

    useDocumentsChange(getUrls)

    return documentUrls;
}