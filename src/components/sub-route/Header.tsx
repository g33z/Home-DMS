'use client'

import { useContext, type FC, type PropsWithChildren } from 'react';
import { Link } from 'waku';
import { SubRouteContext } from './context';


const Header: FC<PropsWithChildren> = (props) => {
    const context = useContext(SubRouteContext);

    return (
        <h1 className='flex items-center justify-items-center text-xl bg-gray-700 text-gray-300'>
            <Link to='/' className="flex">
                <span className='iconify lucide--arrow-left m-6'></span>
            </Link>
            <span className='w-full text-center'>{ context.title }</span>
            { props.children }
        </h1>
    );
};

export default Header;