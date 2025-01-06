import type { FC } from 'react';

interface LoadingScreenProps {
    message: string
}

const LoadingScreen: FC<LoadingScreenProps> = (props) => {
    
    return (
        <div className='bg-gray-900 h-screen text-white text-2xl flex flex-col items-center justify-center gap-3'>
            <span className='iconify lucide--loader-circle animate-spin text-5xl'/>
            { props.message }
        </div>
    );
};

export default LoadingScreen;