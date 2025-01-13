import type { FC } from 'react';
import { twMerge } from 'tailwind-merge';

interface LoadingScreenProps {
    message: string
    className?: string
}

const LoadingScreen: FC<LoadingScreenProps> = (props) => {
    
    return (
        <div className={ twMerge('bg-gray-900 h-screen text-white text-xl flex flex-col items-center justify-center gap-5', props.className) }>
            <span className='iconify lucide--loader-circle animate-spin text-4xl'/>
            { props.message }
        </div>
    );
};

export default LoadingScreen;