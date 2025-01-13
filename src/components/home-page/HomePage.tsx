'use client'

import { useEffect, useState, type FC } from 'react';
import GoToNew from './GoToNew';
import Documents from './Documents';
import Icon from '../../images/Icon.svg';
import Searchbar from './Searchbar';
import { useQuery } from '@tanstack/react-query';
import pb from '../../lib/pocketbase';
import { ExpandedDoc, filterDocuments } from '../../lib/document/service';
import LoadingScreen from '../LoadingScreen';


const HomePage: FC = (props) => {
    const [searchbarValue, setSearchbarValue] = useState('');
    const [search, setSearch] = useState('');

    const documents = useQuery({ 
        queryFn: () => pb
            .collection('documents')
            .getFullList<ExpandedDoc>({ 
                expand: 'pages,tags', 
                sort: '-uploadedAt'
            }),
        queryKey: ['documents', search]
    });
    const [filteredDocuments, setFilteredDocuments] = useState(documents.data);

    useEffect(() => {
        if(documents.data === undefined){
            setFilteredDocuments(undefined)
            return
        }
        setFilteredDocuments(filterDocuments(documents.data, search))
    }, [documents, search]);

    function onSearch(query: string){
        setSearchbarValue(query)

        if(query === ''){
            setSearch('');
            return;
        }
        if(query === query.trim()) return;
        setSearch(query)
    }
    
    return (
        <div className='h-screen grid grid-rows-[auto_1fr] bg-gray-900'>
            <header className="px-5 py-3 flex gap-5 shadow-lg bg-gray-800">
                <img src={ Icon } alt="Home-DMS Logo" className="w-8" />
                <Searchbar value={ searchbarValue } onChange={ onSearch } onSubmit={ setSearch }/>
            </header>
            <main className='overflow-y-scroll'>
                { filteredDocuments &&
                    <Documents
                        documents={ filteredDocuments }
                        onTagClick={ keyword =>
                            setSearchbarValue(v => {
                                const query = v
                                    ? `${searchbarValue} ${keyword}`
                                    : keyword;
                                setSearch(query);
                                return query;
                            })
                        }
                    />
                }
                { documents.isPending &&
                    <LoadingScreen message='Documents loading...' className='h-full'/>
                }
                { documents.isError &&
                    <div className='flex items-center justify-center text-lg text-white h-full'>
                        Could not load Documents
                    </div>
                }
                <GoToNew className='absolute bottom-8 right-8 shadow'/>
            </main>
        </div>
    );
};

export default HomePage;