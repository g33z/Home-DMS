'use client'

import { useEffect, useState, type FC } from 'react';
import { useRouter_UNSTABLE as useRouter } from 'waku';
import Menu, { MenuOptions } from './Menu';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import EditActions from './EditActions';
import { PagesRecord } from '../../lib/pocketbase/pb-types';
import { deleteDocument, ExpandedDoc, updateDocument, UpdateDocumentOptions } from '../../lib/document/service';
import DeleteWarningDialog from './DeleteWarningDialog';
import SubRoute from '../sub-route';
import DetailView from '../detail-view/DetailView';


function mapExpandedPages(pages: PagesRecord[]): UpdateDocumentOptions['pages'] {
    return pages.map(page => ({
        id: page.id,
        url: `${import.meta.env.WAKU_PUBLIC_PB_URL ?? ''}/api/files/pages/${page.id}/${page.file}`
    }))
}

interface DocumentDetailsProps {
    document: ExpandedDoc
}

const DocumentDetails: FC<DocumentDetailsProps> = (props) => {
    const [tags, setTags] = useState<UpdateDocumentOptions['tags']>(props.document.expand.tags);
    const [pages, setPages] = useState(mapExpandedPages(props.document.expand.pages));
    const [editMode, setEditMode] = useState(false);
    const [deleteWarningModalOpen, setDeleteWarningModalOpen] = useState(false);

    const queryClient = useQueryClient()
    const router = useRouter()

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
                setDeleteWarningModalOpen(true);
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
    
    return (<>
        <SubRoute.Header>
            { editMode 
                ? <EditActions onCancel={ onEditCancel } onSave={ onEditSave } loading={ updateMutation.isPending }/>
                : <Menu onSelect={ onMenuSelect }/>
            }
        </SubRoute.Header>
        <SubRoute.Body className='flex flex-col gap-4'>
            <DetailView
                editMode={ editMode }
                pages={ pages }
                onPagesChange={ setPages }
                tags={ tags }
                onTagsChange={ setTags }
            />
            { deleteMutation.isPending &&
                <div className='absolute inset-0 bg-[#01010174] text-2xl flex flex-col items-center justify-center gap-3'>
                    <span className='iconify lucide--loader-circle animate-spin text-5xl'/>
                    Deleting...
                </div>
            }
        </SubRoute.Body>
        <DeleteWarningDialog
            open={ deleteWarningModalOpen }
            onOpenChange={ setDeleteWarningModalOpen }
            onDelete={ () => {
                setDeleteWarningModalOpen(false)
                deleteMutation.mutate();
            }}
        />
    </>);
};

export default DocumentDetails;