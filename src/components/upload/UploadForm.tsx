'use client'

import { useMutation } from '@tanstack/react-query';
import { useState, type FC } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { addDocument } from '../../lib/document/actions';
import { twMerge } from 'tailwind-merge';

interface UploadFormProps {
    files: File[]
    onUploaded?: () => void
}

const UploadForm: FC<UploadFormProps> = (props) => {
    const [isTitleInputFocused, setIsTitleInputFocused] = useState(false);
    const [titleInput, setTitleInput] = useState('');

    const addDoc = useMutation({
        mutationFn: addDocument,
        onSuccess: () => props.onUploaded?.()
    });
    
    return (
        <form 
            className='m-6 flex flex-col gap-6 h-full justify-around'
            onSubmit={ e => {
                e.preventDefault();
                addDoc.mutate({
                    name: titleInput,
                    pages: props.files
                })
            } }
        >
            <label className='text-2xl flex gap-6 text-gray-200 has-[:focus-visible]:text-white'>
                <TextareaAutosize 
                    className='bg-transparent outline-none min-w-0 resize-none' 
                    placeholder='Name of Document...'
                    onFocus={ () => setIsTitleInputFocused(true) }
                    onBlur={ () => setIsTitleInputFocused(false) }
                    spellCheck={ isTitleInputFocused }
                    onChange={ e => setTitleInput(e.target.value) }
                />
                <span className='iconify lucide--edit-2 h-8 shrink-0'></span>
            </label>
            <div className='flex overflow-x-auto snap-x snap-proximity scroll-p-3 -mx-6 last:pr-6 pb-4'>
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
            <button 
                className='bg-emerald-500 rounded-lg text-xl p-2 flex gap-2 items-center justify-center mb-5 disabled:brightness-50'
                disabled={ titleInput === '' }
            >
                <span className={ twMerge('iconify', addDoc.isPending ? 'lucide--loader-circle animate-spin' : 'lucide--save') }></span>
                <span className='mb-1'>save</span>
            </button>
        </form>
    );
};

export default UploadForm;