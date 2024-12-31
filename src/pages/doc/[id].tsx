import type { FC } from 'react';
import { Link } from 'waku';
import { getDocumentDetails } from '../../lib/document/actions';
import ErrorScreen from '../../components/ErrorScreen';
import Tag from '../../components/Tag';

interface DocumentDetailsProps {
    id: string
}

const DocumentDetails: FC<DocumentDetailsProps> = async (props) => {
    const documentId = parseInt(props.id, 10);

    if(Number.isNaN(documentId)) return (
        <ErrorScreen message='Document ID not valid!'/>
    );

    const document = await getDocumentDetails(documentId)

    if(document === undefined) return (
        <ErrorScreen message='Document not found!'/>
    );
    
    return (
        <div className='bg-gray-900 text-white grid grid-rows-[auto_1fr] h-screen'>
            <h2 className='grid grid-cols-[1fr_auto] items-center text-xl bg-gray-700 text-gray-300'>
                <span className='ml-6'>View Document Details</span>
                <Link to='/' className="flex">
                    <span className='iconify lucide--x m-6'></span>
                </Link>
            </h2>
            <div className='overflow-y-auto'>
                <section className='m-2'>
                    <h3 className='text-lg font-bold text-gray-300'>Tags</h3>
                    <div className='flex gap-1 m-2'>
                        { document.tagKeywords.map(tag =>
                            <Tag keyword={ tag }/>
                        )}
                    </div>
                </section>
                <section className='m-2'>
                    <h3 className='text-lg font-bold text-gray-300'>Pages</h3>
                    <div className='flex flex-col gap-3 m-2'>
                        { document.pages.map(pageUrl =>
                            <img key={ pageUrl } src={ pageUrl }/>
                        ) }
                    </div>
                </section>
            </div>
        </div>
    );
};

export default DocumentDetails;

export const getConfig = async () => {
	return {
		render: 'dynamic',
	} as const;
};