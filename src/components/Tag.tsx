import type { FC } from 'react';

interface TagProps {
    keyword: string
    onClick?: (() => void) | undefined
    deletable?: boolean
}

const Tag: FC<TagProps> = (props) => {
    
    return (
        <button 
            className='flex gap-0.5 items-center bg-violet-900 border border-violet-600 rounded-md px-1 shrink-0 text-gray-200'
            onClick={ props.onClick }
            type='button'
            disabled={ props.onClick === undefined }
        >
            { props.deletable && <span className='iconify lucide--x'/> }
            <span className='pb-0.5 whitespace-nowrap'>{ props.keyword }</span>
        </button>
    );
};

export default Tag;