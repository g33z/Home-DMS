'use client'

import type { FC } from 'react';

interface SearchbarProps {
    
}

const Searchbar: FC<SearchbarProps> = (props) => {
    
    return (
        <div className="grid grid-cols-[1fr_2.6rem] grid-rows-1 items-center grow text-white">
            <input
                type="text"
                placeholder='Search'
                className="bg-transparent rounded-lg border-2 border-gray-500 px-4 py-2 focus:border-violet-500 focus:ring-0 disabled:border-gray-700 disabled:text-gray-700 row-start-1 col-start-1 col-span-2"
            />
            <button
                className="row-start-1 col-start-2 m-auto h-4/6 w-4/6 rounded overflow-hidden iconify lucide--search text-gray-400" type="button"
            >
            </button>
        </div>
    );
};

export default Searchbar;