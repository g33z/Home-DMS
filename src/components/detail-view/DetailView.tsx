'use client'

import { Fragment, useState, type FC } from 'react';
import { Link, useRouter_UNSTABLE as useRouter } from 'waku';
import Tag from '../Tag';
import Menu, { MenuOptions } from './Menu';
import { DocumentDetails, removeDocument, updateDocument, UpdateDocumentOptions } from '../../lib/document/actions';
import { useMutation } from '@tanstack/react-query';
import EditActions from './EditActions';
import TagInput from '../TagInput';
import Page from './Page';
import AddPage from './AddPage';

interface DetailViewProps {
    document: DocumentDetails
}

const DetailView: FC<DetailViewProps> = (props) => {
    const [tags, setTags] = useState(props.document.tags);
    const [pages, setPages] = useState(props.document.pages);
    const [editMode, setEditMode] = useState(false);
    const router = useRouter()

    const deleteMutation = useMutation({
        mutationFn: () => removeDocument(props.document.id),
        onSuccess: () => router.push('/')
    })

    const updateMutation = useMutation({
        mutationFn: (options: UpdateDocumentOptions) => 
            updateDocument(props.document.id, options),
        onSuccess: () => setEditMode(false)
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
            tags
        })
    }

    function onEditCancel(){
        setEditMode(false)
        setTags(props.document.tags)
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
                            <AddPage loading onClick={ () => {}}/>
                        }
                        { pages.map(pageUrl =>
                            <Fragment key={ pageUrl }>
                                <Page 
                                    src={ pageUrl } 
                                    editable={ editMode }
                                    onDelete={ () => {} }
                                    deleteLoading
                                />
                                { editMode &&
                                    <AddPage loading onClick={ () => {}}/>
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