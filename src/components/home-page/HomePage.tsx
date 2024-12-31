'use client'

import type { FC } from 'react';
import { DocumentPreview } from '../../lib/document/actions';
import GoToNew from '../upload/GoToNew';
import Documents from './Documents';
import Icon from '../../images/Icon.svg';
import Searchbar from './Searchbar';

interface HomePageProps {
    documents: DocumentPreview[]
}

const HomePage: FC<HomePageProps> = (props) => {
    
    return (
        <div className='grid grid-rows-[auto_1fr] h-screen'>
			<header className="bg-gray-800 px-5 py-3 flex gap-5 shadow-lg">
				<img src={ Icon } alt="Home-DMS Logo" className="w-8" />
				<Searchbar/>
			</header>
			<main className='overflow-y-auto'>
				<Documents documents={ props.documents }/>
				<GoToNew className='absolute bottom-8 right-8'/>
			</main>
		</div>
    );
};

export default HomePage;