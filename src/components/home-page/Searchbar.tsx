'use client'

import type { FC } from 'react';

interface SearchbarProps {
    value: string
    onChange: (value: string) => void
    onSubmit?: (value: string) => void
}

const Searchbar: FC<SearchbarProps> = (props) => {
    
    return (<>
        <form 
            className="grid grid-cols-[1fr_2.6rem] grid-rows-1 items-center grow text-white"
            onSubmit={ e => {
                e.preventDefault();
                props.onSubmit?.(new FormData(e.target as HTMLFormElement).get('search') as string)
            }}
        >
            <input
                type="text"
                placeholder='Search'
                name='search'
                className="bg-transparent rounded-lg border-2 border-gray-500 px-4 py-2 focus:border-violet-500 focus:ring-0 disabled:border-gray-700 disabled:text-gray-700 row-start-1 col-start-1 col-span-2"
                value={props.value }
                onChange={ e => props.onChange?.(e.target.value) }
            />
            <button
                className="row-start-1 col-start-2 m-auto h-4/6 w-4/6 rounded overflow-hidden iconify lucide--search text-gray-400" type="button"
            >
            </button>
        </form>
    </>);
};

export default Searchbar;