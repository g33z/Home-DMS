import type { FC, PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';

interface BodyProps {
    className?: string
}

const Body: FC<PropsWithChildren<BodyProps>> = (props) => {
    
    return (
        <div className={ twMerge('overflow-y-auto p-6 text-white', props.className) }>
            { props.children }
        </div>
    );
};

export default Body;