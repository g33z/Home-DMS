import type { FC } from 'react';
import { twMerge } from 'tailwind-merge';
import { Link } from 'waku';

interface GoToNewProps {
    className?: string
}

const GoToNew: FC<GoToNewProps> = (props) => {
    return (
        <Link
            to='/new'
			className={ twMerge(
				'bg-violet-600 rounded-full flex items-center justify-center p-4',
				props.className
			) }
		>
			<span className='iconify text-white text-2xl lucide--file-plus'></span>
		</Link>
    );
};

export default GoToNew;