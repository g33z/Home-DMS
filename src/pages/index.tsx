import Documents from "../components/Documents";
import { getDocuments } from "../lib/document/actions";
import Icon from '../images/Icon.svg';
import Upload from "../components/upload/Upload";


export default async function HomePage() {
	const documents = await getDocuments();

	return (
		<div className='grid grid-rows-[auto_1fr] h-screen'>
			<header className="bg-gray-800 px-5 py-3 flex gap-5 shadow-lg">
				<img src={ Icon } alt="Home-DMS Logo" className="w-8" />
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
			</header>
			<main className='overflow-y-auto'>
				<Documents documents={ documents }/>
				<Upload className='absolute bottom-10 right-10'/>
			</main>
		</div>
	);
}

export const getConfig = async () => {
	return {
		render: 'dynamic',
	} as const;
};
