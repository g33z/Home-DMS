'use client'

import type { FC, PropsWithChildren } from 'react';
import { SubRouteContext } from './context';

interface WrapperProps {
    title: string
}

const Wrapper: FC<PropsWithChildren<WrapperProps>> = (props) => {
    return (
        <SubRouteContext.Provider value={{ title: props.title }}>
            <title>{`${props.title} | Home-DMS`}</title>
            <div className='h-screen grid grid-rows-[auto_1fr] bg-gray-900 text-white'>
                { props.children }
            </div>
        </SubRouteContext.Provider>  
    );
};

export default Wrapper;