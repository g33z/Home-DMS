import type { FC } from 'react';

interface TagProps {
    keyword: string
    onDelete?: () => void
}

const Tag: FC<TagProps> = (props) => {
    
    return (
        <button 
            className='flex gap-0.5 items-center bg-violet-950 border border-violet-600 rounded-md px-1 shrink-0'
            onClick={ props.onDelete }
            type='button'
        >
            { props.onDelete && <span className='iconify lucide--x'/> }
            <span className='pb-0.5 whitespace-nowrap'>{ props.keyword }</span>
        </button>
    );
};

export default Tag;