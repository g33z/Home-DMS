'use client'

import { type FC } from 'react';
import Document from './document/Document';
import { DocumentPreview } from '../../lib/document/actions';
import { DocumentsRecord } from '../../lib/pocketbase/pb-types';

interface DocumentsProps {
    documents: DocumentsRecord[]
    onTagClick: (keyword: string) => void
}

const Documents: FC<DocumentsProps> = (props) => {
    if(props.documents.length < 1) return (
        <div>No Documents available.</div>
    );

    return (
        <div className='grid grid-cols-[repeat(auto-fill,minmax(8rem,1fr))] gap-5 p-5 text-white'>
            { props.documents.map(document => 
                <Document key={ document.id } document={ document } onTagClick={ props.onTagClick }/>
            ) }
        </div>
    )
};

export default Documents;