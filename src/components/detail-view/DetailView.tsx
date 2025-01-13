import { Fragment, type FC } from 'react';
import AddPage from './AddPage';
import Page from './Page';
import TagInput from './TagInput';
import { PageType, TagType } from '../../lib/document/service';

interface DetailViewProps {
    editMode: boolean
    tags: TagType[]
    onTagsChange: (change: (tags: TagType[]) => TagType[]) => void
    pages: PageType[]
    onPagesChange: (change: (pages: PageType[]) => PageType[]) => void
}

const DetailView: FC<DetailViewProps> = (props) => {
    function addPages(files: File[], index: number){
        props.onPagesChange(pages => 
            pages.toSpliced(index, 0, ...files.map(file => ({
                id: crypto.randomUUID(),
                url: URL.createObjectURL(file),
                file: file
            })))
        )
    }

    function removePage(id: string){
        props.onPagesChange(pages => pages.filter(page => page.id !== id))
    }

    return (<>
        <section>
            <h3 className='text-xl font-bold text-gray-300'>Tags</h3>
            <TagInput 
                tags={ props.tags }
                onTagsChange={ props.onTagsChange } 
                editable={ props.editMode }
                className='m-2'
            />
        </section>
        <section>
            <h3 className='text-xl font-bold text-gray-300'>Pages</h3>
            <div className='grid gap-3 m-2'>
                { props.editMode &&
                    <AddPage onAdd={ files => addPages(files, 0) }/>
                }
                { props.pages.map((page, index) =>
                    <Fragment key={ page.id }>
                        <Page 
                            src={ page.url }
                            deletable={ props.editMode }
                            onDelete={ () => removePage(page.id) }
                        />
                        { props.editMode &&
                            <AddPage onAdd={ files => addPages(files, index+1) }/>
                        }
                    </Fragment>
                ) }
            </div>
        </section>
    </>);
};

export default DetailView;