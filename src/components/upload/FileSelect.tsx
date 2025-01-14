import { ChangeEvent, useEffect, useRef, useState, type FC } from 'react';
import { twMerge } from 'tailwind-merge';

interface FileSelectProps {
    onSelected: (files: File[]) => void
}

let count = 0;

const FileSelect: FC<FileSelectProps> = (props) => {
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    function choseFiles(event: ChangeEvent<HTMLInputElement>){
        setLoading(false);
        const fileList = event.target.files;

        if(fileList === null) return;
        const files = Array.from(fileList)
        if(files.length < 1) return;

        props.onSelected(files)
    }
    
    useEffect(() => {
        if(history.state !== null){ // is the page loaded by user or by link - TODO: Detection does not work
            count++
            console.log('opened', count)
            fileInputRef.current?.click();
        }

        const onCancel = () => setLoading(false);
        fileInputRef.current?.addEventListener('cancel', onCancel)
        
        return () => fileInputRef.current?.removeEventListener('cancel', onCancel)
    }, []);
    
    return (
        <label 
            className='h-full flex flex-col items-center justify-center p-4 text-xl text-white gap-5 cursor-pointer'
            onClick={ () => setLoading(true) }
        >
            <input 
                className='sr-only'
                type='file' 
                multiple 
                onChange={choseFiles} 
                ref={ fileInputRef }
            />
            <span 
                className={ twMerge(
                    "iconify text-5xl",
                    loading ? 'lucide--loader-circle animate-spin' : 'lucide--file-plus'
                )}
            />
            <h2>{ loading ? 'Selecting' : 'Select' } File(s)</h2>
        </label>
    );
};

export default FileSelect;