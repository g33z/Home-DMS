'use client'

import { useMutation } from '@tanstack/react-query';
import { useState, type FC } from 'react';
import { twMerge } from 'tailwind-merge';
import TagInput from '../TagInput';
import { addDocument, TagType } from '../../lib/document/service';

interface UploadFormProps {
    files: File[]
    onUploaded?: () => void
}

const UploadForm: FC<UploadFormProps> = (props) => {
    const [tags, setTags] = useState<TagType[]>([]);

    const addDoc = useMutation({
        mutationFn: () => addDocument(
            tags,
            props.files
        ),
        onSuccess: () => props.onUploaded?.()
    });
    
    return (
        <div className='my-6 flex flex-col gap-6 h-full min-h-0 text-white'>
            <div className='flex overflow-x-auto snap-x snap-proximity scroll-p-3 pr-6 pb-4 min-h-96'>
                { props.files.map(file =>
                    <div 
                        className='snap-start shrink-0 w-[calc(100vw-3rem)] pl-6'
                        key={ file.name + file.size }
                    >
                        <img
                            src={ URL.createObjectURL(file) } 
                            className='pointer-events-none w-full h-full object-contain'
                        />
                    </div>
                ) }
            </div>
            <TagInput
                tags={ tags }
                onTagsChange={ setTags }
                editable
                className='mx-6'
            />
            <button 
                className='bg-emerald-500 rounded-lg text-xl p-2 flex gap-2 items-center justify-center mb-5 disabled:brightness-50 mt-auto mx-6'
                disabled={ tags.length === 0 }
                onClick={ () => addDoc.mutate() }
            >
                <span className={ twMerge('iconify', addDoc.isPending ? 'lucide--loader-circle animate-spin' : 'lucide--save') }></span>
                <span className='mb-1'>save</span>
            </button>
        </div>
    );
};

export default UploadForm;