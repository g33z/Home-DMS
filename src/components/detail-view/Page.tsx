import type { FC } from 'react';

interface PageProps {
    src: string
    deletable?: boolean
    onDelete: () => void
}

const Page: FC<PageProps> = (props) => {
    
    return (
        <div className='relative'>
            <img src={ props.src } className='w-full'/>
            { props.deletable &&
                <button className='absolute top-0 right-0 text-white text-xl p-4 flex rounded-bl-lg overflow-clip' onClick={ props.onDelete }>
                    <div className='absolute inset-0 bg-red-600 opacity-80'/>
                    <span className='iconify mb-1 ml-1 lucide--trash'/>
                </button>
            }
        </div>
    );
};

export default Page;