import type { FC } from 'react';
import { Link } from 'waku';
import { DocumentPreview } from '../../../lib/document/actions';
import Tag from '../../Tag';

interface DocumentProps {
    document: DocumentPreview
    onTagClick: (keyword: string) => void
}

const Document: FC<DocumentProps> = (props) => {
    const halfLength = Math.ceil(props.document.tags.length / 2)

    const tags = [
        props.document.tags.slice(0, halfLength),
        props.document.tags.slice(halfLength)
    ] as const

    return (<>
        <article className="bg-gray-800 rounded-xl relative overflow-hidden h-40 text-sm flex flex-col items-stretch">
            <Link to={ `/doc/${props.document.id}` } className="relative overflow-hidden">
                <img loading='lazy' src={ props.document.thumbnail } className='p-5 pb-px object-cover min-h-[10rem]'/>     
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[rgba(0,0,0,0.2)] to-transparent mx-5 h-3"></div>
            </Link>
            <div className="bg-gray-700 p-2 relative min-h-[4rem]">
                <div className='flex flex-col gap-1'>
                    <span className='flex gap-1'>
                        { tags[0].map(tag =>
                            <Tag key={ tag } keyword={ tag } onClick={ () => props.onTagClick(tag) }/>
                        ) }
                    </span>
                    <span className='flex gap-1'>
                        { tags[1].map(tag =>
                            <Tag key={ tag } keyword={ tag } onClick={ () => props.onTagClick(tag) }/>
                        ) }
                    </span>
                </div>
                <div className='absolute right-0 top-0 bottom-0 w-2 bg-gradient-to-r from-transparent to-gray-700'></div>
            </div>
        </article>
    </>);
};

export default Document;