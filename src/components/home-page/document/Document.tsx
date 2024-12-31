import type { FC } from 'react';
import DeleteButton from './DeleteButton';
import { Link } from 'waku';
import { DocumentPreview } from '../../../lib/document/actions';

interface DocumentProps {
    document: DocumentPreview
}

const Document: FC<DocumentProps> = (props) => {
    return (
        <article className='flex flex-col gap-1'>
            <Link to={ `/doc/${props.document.id}` } >
                <img loading='lazy' src={ props.document.thumbnail } className='h-full object-cover' />
            </Link> 
            <h2 className='flex'>
                { props.document.tagKeywords.join(' ') }
                <DeleteButton className='ml-auto' documentId={ props.document.id }/>
            </h2>
        </article>
    );
};

export default Document;