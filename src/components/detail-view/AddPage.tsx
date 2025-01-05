import type { FC } from 'react';
import { twJoin } from 'tailwind-merge';

interface AddPageProps {
    onClick: () => void
    loading: boolean
}

const AddPage: FC<AddPageProps> = (props) => {
    
    return (
        <button className='flex gap-3 items-center justify-center p-2 rounded-md border-2 border-dashed border-gray-400 text-lg'>
            <span className={ twJoin(
                'iconify text-xl',
                props.loading ? 'lucide--loader-circle animate-spin' : 'lucide--file-plus'
            ) }/>
            { props.loading ? 'Selecting' : 'Add'} Page
        </button>
    );
};

export default AddPage;