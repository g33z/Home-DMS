'use client'

import type { FC } from 'react';
import Document from './document/Document';
import { DocumentSource, useDocuments } from '../lib/document/hooks';

interface DocumentsProps {
    documents: DocumentSource[]
}

const Documents: FC<DocumentsProps> = (props) => {
    const documents = useDocuments(props.documents);

    if(documents.length < 1) return (
        <div>No Documents available.</div>
    );

    return (
        <div className='grid grid-cols-2 m-5 gap-5'>
            { documents.map(document => 
                <Document key={ document.id } document={ document }/>
            ) }
        </div>
    )
};

export default Documents;