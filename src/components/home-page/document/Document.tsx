import type { FC } from 'react';
import { Link } from 'waku';
import Tag from '../../Tag';
import { ExpandedDoc } from '../HomePage';

interface DocumentProps {
    document: ExpandedDoc
    onTagClick: (keyword: string) => void
}

const Document: FC<DocumentProps> = (props) => {
    const halfLength = Math.ceil(props.document.tags.length / 2)

    const tags = props.document.expand.tags.map(t => t.keyword)
    const slicedTags = [
        tags.slice(0, halfLength),
        tags.slice(halfLength)
    ] as const

    const thumbnailPage = props.document.expand.pages[0]!

    return (<>
        <article className="bg-gray-800 rounded-xl relative overflow-hidden h-40 text-sm flex flex-col items-stretch">
            <Link to={ `/doc/${props.document.id}` } className="relative overflow-hidden">
                <img 
                    loading='lazy' 
                    src={ `${import.meta.env.WAKU_PUBLIC_PB_URL}/api/files/pages/${thumbnailPage.id}/${thumbnailPage.file}?thumb=150x0` } 
                    className='p-5 pb-px object-cover min-h-[10rem] w-full'
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[rgba(0,0,0,0.2)] to-transparent mx-5 h-3"></div>
            </Link>
            <div className="bg-gray-700 p-2 relative min-h-[4rem]">
                <div className='flex flex-col gap-1'>
                    <span className='flex gap-1'>
                        { slicedTags[0].map(tag =>
                            <Tag key={ tag } keyword={ tag } onClick={ () => props.onTagClick(tag) }/>
                        ) }
                    </span>
                    <span className='flex gap-1'>
                        { slicedTags[1].map(tag =>
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