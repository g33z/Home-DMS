import { ChangeEvent, useRef, useState, type FC } from 'react';
import { twJoin } from 'tailwind-merge';

interface AddPageProps {
    onAdd: (files: File[]) => void
}

const AddPage: FC<AddPageProps> = (props) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [fileSelectLoading, setFileSelectLoading] = useState(false);

    function choseFiles(event: ChangeEvent<HTMLInputElement>){
        setFileSelectLoading(false);
        const fileList = event.target.files;

        if(fileList === null) return;
        const files = Array.from(fileList)
        if(files.length < 1) return;

        props.onAdd(files);
    }
    
    return (
        <label 
            className='flex gap-3 items-center justify-center p-2 rounded-md border-2 border-dashed border-gray-500 text-gray-300 text-lg cursor-pointer'
            onClick={ () => setFileSelectLoading(true) }
        >
            <input 
				className='sr-only' 
				type='file' 
				multiple 
				onChange={choseFiles} 
				ref={ fileInputRef }
			/>
            <span className={ twJoin(
                'iconify text-xl',
                fileSelectLoading ? 'lucide--loader-circle animate-spin' : 'lucide--file-plus'
            ) }/>
            { fileSelectLoading ? 'Selecting' : 'Add'} Pages
        </label>
    );
};

export default AddPage;