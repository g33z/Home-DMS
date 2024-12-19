'use client'

import { useEffect, type FC } from 'react';
import supabase from '../../lib/supabase/client';

interface DeleteButtonProps {
    className?: string
    filePath: string
}

const DeleteButton: FC<DeleteButtonProps> = (props) => {
    

    function deleteDoc(){
        supabase.storage
            .from('documents')
            .remove([props.filePath])
    }
    
    return (
        <button 
            className={ props.className }
            onClick={ deleteDoc }
        >
            x
        </button>
    );
};

export default DeleteButton;