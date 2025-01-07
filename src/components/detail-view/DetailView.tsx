'use client'

import { Fragment, useEffect, useState, type FC } from 'react';
import { Link, useRouter_UNSTABLE as useRouter } from 'waku';
import Menu, { MenuOptions } from './Menu';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import EditActions from './EditActions';
import TagInput from '../TagInput';
import Page from './Page';
import AddPage from './AddPage';
import { PagesRecord } from '../../lib/pocketbase/pb-types';
import { deleteDocument, ExpandedDoc, PageType, updateDocument, UpdateDocumentOptions } from '../../lib/document/service';


function mapExpandedPages(pages: PagesRecord[]): UpdateDocumentOptions['pages'] {
    return pages.map(page => ({
        id: page.id,
        url: `${import.meta.env.WAKU_PUBLIC_PB_URL}/api/files/pages/${page.id}/${page.file}`
    }))
}

interface DetailViewProps {
    document: ExpandedDoc
}

const DetailView: FC<DetailViewProps> = (props) => {
    const [tags, setTags] = useState<UpdateDocumentOptions['tags']>(props.document.expand.tags);
    const [pages, setPages] = useState(mapExpandedPages(props.document.expand.pages));
    const [editMode, setEditMode] = useState(false);

    const queryClient = useQueryClient()
    const router = useRouter()

    console.log('pages', pages)

    useEffect(() => {
        setTags(props.document.expand.tags)
    }, [props.document.expand.tags]);

    useEffect(() => {
        setPages(mapExpandedPages(props.document.expand.pages))
    }, [props.document.expand.pages]);

    const deleteMutation = useMutation({
        mutationFn: async () => deleteDocument(props.document),
        onSuccess: () => router.push('/')
    })

    const updateMutation = useMutation({
        mutationFn: (options: UpdateDocumentOptions) => 
            updateDocument(props.document, options),
        onSuccess: (data) => {
            setEditMode(false);
            queryClient.setQueryData(
                ['documents', 'record', props.document.id],
                data
            )
        }
    })

    function onMenuSelect(selected: MenuOptions){
        switch (selected) {
            case 'delete':
                deleteMutation.mutate();
                return;
            case 'edit':
                setEditMode(true);
                return;
        }
    }

    function onEditSave(){
        updateMutation.mutate({
            tags,
            pages
        })
    }

    function onEditCancel(){
        setEditMode(false)
        setTags(props.document.expand.tags)
        setPages(mapExpandedPages(props.document.expand.pages))
    }

    function addPages(files: File[], index: number){
        setPages(pages => 
            pages.toSpliced(index, 0, ...files.map(file => ({
                url: URL.createObjectURL(file),
                file: file
            }) satisfies PageType))
        )
    }

    function removePage(index: number){
        setPages(pages => pages.toSpliced(index, 1))
    }
    
    return (
        <div className='bg-gray-900 text-white grid grid-rows-[auto_1fr] h-screen'>
            <h2 className='flex items-center justify-items-center text-xl bg-gray-700 text-gray-300'>
                <Link to='/' className="flex">
                    <span className='iconify lucide--arrow-left m-6'></span>
                </Link>
                <span className='w-full text-center'>{ editMode ? 'Edit' : 'View' } Document Details</span>
                { editMode 
                    ? <EditActions onCancel={ onEditCancel } onSave={ onEditSave } loading={ updateMutation.isPending }/>
                    : <Menu onSelect={ onMenuSelect }/>
                }
            </h2>
            <div className='overflow-y-auto p-6 flex flex-col gap-4'>
                <section>
                    <h3 className='text-xl font-bold text-gray-300'>Tags</h3>
                    <TagInput 
                        tags={ tags } 
                        onTagsChange={ setTags } 
                        editable={ editMode }
                        className='m-2'
                    />
                </section>
                <section>
                    <h3 className='text-xl font-bold text-gray-300'>Pages</h3>
                    <div className='flex flex-col gap-3 m-2'>
                        { editMode &&
                            <AddPage onAdd={ files => addPages(files, 0) }/>
                        }
                        { pages.map((page, index) =>
                            <Fragment key={ page.url }>
                                <Page 
                                    src={ page.url }
                                    deletable={ editMode }
                                    onDelete={ () => removePage(index) }
                                />
                                { editMode &&
                                    <AddPage onAdd={ files => addPages(files, index+1) }/>
                                }
                            </Fragment>
                        ) }
                    </div>
                </section>
            </div>
            { deleteMutation.isPending &&
                <div className='absolute inset-0 bg-[#01010174] text-2xl flex flex-col items-center justify-center gap-3'>
                    <span className='iconify lucide--loader-circle animate-spin text-5xl'/>
                    Deleting...
                </div>
            }
        </div>
    );
};

export default DetailView;