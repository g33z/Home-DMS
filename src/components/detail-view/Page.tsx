import type { FC } from 'react';
import { twJoin } from 'tailwind-merge';

interface PageProps {
    src: string
    editable?: boolean
    onDelete: () => void
    deleteLoading: boolean
}

const Page: FC<PageProps> = (props) => {
    
    return (
        <div className='relative'>
            <img key={ props.src } src={ props.src }/>
            <button className='absolute top-0 right-0 text-white text-xl p-4 flex rounded-bl-lg overflow-clip'>
                <div className='absolute inset-0 bg-red-600 opacity-80'/>
                <span className={ twJoin(
                    'iconify mb-1 ml-1',
                    props.deleteLoading ? 'lucide--loader-circle animate-spin' : 'lucide--trash'
                ) }/>
            </button>
        </div>
    );
};

export default Page;