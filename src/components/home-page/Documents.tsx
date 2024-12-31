'use client'

import { type FC } from 'react';
import Document from './document/Document';
import { DocumentPreview } from '../../lib/document/actions';

interface DocumentsProps {
    documents: DocumentPreview[]
}

const Documents: FC<DocumentsProps> = (props) => {
    if(props.documents.length < 1) return (
        <div>No Documents available.</div>
    );

    return (
        <div className='grid grid-cols-2 m-5 gap-5'>
            { props.documents.map(document => 
                <Document key={ document.id } document={ document }/>
            ) }
        </div>
    )
};

export default Documents;