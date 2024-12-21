'use client'

import type { FC } from 'react';
import DeleteButton from './DeleteButton';
import type { DocumentSource } from '../../lib/document/hooks';
import { useMutation } from '@tanstack/react-query';

interface DocumentProps {
    document: DocumentSource
}

const Document: FC<DocumentProps> = (props) => {
    return (
        <article className='flex flex-col gap-1'>
            <img src={ props.document.thumbnail } className='h-full object-cover' />
            <h2 className='flex'>
                { props.document.name }
                <DeleteButton className='ml-auto' documentId={ props.document.id }/>
            </h2>
        </article>
    );
};

export default Document;