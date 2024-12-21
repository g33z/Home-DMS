import { useEffect, useState, useSyncExternalStore } from "react"
import supabase from "../supabase/client"
import { getDocuments } from "./actions"

export function useDocumentsChange(onChange: () => void){
    useEffect(() => {
        const channel = supabase
            .channel('schema-db-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'documents'
                },
                onChange
            )
            .subscribe()

        return () => { channel.unsubscribe() }
    }, [])
}

export interface DocumentSource {
    id: number
    name: string
    thumbnail: string
}

export function useDocuments(documents: DocumentSource[]){
    const [documentUrls, setDocumentUrls] = useState<DocumentSource[]>(documents);

    useDocumentsChange(() => getDocuments().then(d => setDocumentUrls(d)))

    return documentUrls;
}