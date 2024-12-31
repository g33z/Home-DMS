'use client'

import { type FC } from 'react';
import { useMutation } from '@tanstack/react-query';
import { removeDocument } from '../../../lib/document/actions';

interface DeleteButtonProps {
    className?: string
    documentId: number
}

const DeleteButton: FC<DeleteButtonProps> = (props) => {
    const deleteDoc = useMutation({
        mutationFn: removeDocument
    })
    
    return (
        <button 
            className={ props.className }
            onClick={ () => deleteDoc.mutate(props.documentId) }
        >
            x
        </button>
    );
};

export default DeleteButton;