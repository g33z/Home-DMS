import type { FC } from 'react';
import { Link } from 'waku';

interface ErrorScreenProps {
    message: string
}

const ErrorScreen: FC<ErrorScreenProps> = (props) => {
    
    return (
        <div className='bg-gray-900 h-screen text-white flex flex-col items-center gap-10 justify-center text-2xl'>
            { props.message }
            <Link 
                className='text-lg font-bold border border-solid border-gray-300 rounded-lg py-3 px-5'
                to='/'
            >
                go back
            </Link>
        </div>
    );
};

export default ErrorScreen;