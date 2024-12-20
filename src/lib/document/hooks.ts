import { use, useEffect, useState } from "react"
import supabase from "../supabase/client"
import { getDocuments } from "./actions"
import { useMutation, UseMutationOptions } from '@tanstack/react-query';

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

export function useDocuments(documents: DocumentSource[]){
    const [documentUrls, setDocumentUrls] = useState<DocumentSource[]>(documents);

    function getUrls(){
        getDocuments().then(d => setDocumentUrls(d))
    }

    useDocumentsChange(getUrls)

    return documentUrls;
}

export function useDocumentMuation(options?: UseMutationOptions<void[], Error, File[], unknown>){
    return useMutation({
        mutationFn: (files: File[]) => {
            const uploads = 
                files.map(file => supabase.storage
                    .from('documents')
                    .upload(
                        crypto.randomUUID(), 
                        file, 
                        { 
                            upsert: true, 
                            metadata: { name: file.name }
                        }
                    )
                    .then(({ data, error }) => {
                        if(error) throw error;
                    })
                );
		
            return Promise.all(uploads)
        },
        ...options,
    })
}