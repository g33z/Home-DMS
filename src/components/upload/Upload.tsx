'use client'

import type { FC } from 'react';
import { useState } from 'react';
import { twJoin } from 'tailwind-merge';
import { useRouter_UNSTABLE as useRouter } from 'waku';
import { useMutation } from '@tanstack/react-query';
import { addDocument, PageType, TagType } from '../../lib/document/service';
import FileSelect from './FileSelect';
import { useToast } from '../primitves/toast/context';
import SubRoute from '../sub-route';
import DetailView from '../detail-view/DetailView';


interface UploadProps {
    className?: string
}

const Upload: FC<UploadProps> = (props) => {
	const [tags, setTags] = useState<TagType[]>([]);
	const [pages, setPages] = useState<PageType[]>([]);
	
	const router = useRouter();

	const toast = useToast()

	const addDoc = useMutation({
        mutationFn: () => addDocument(
            tags,
            pages.map(p => p.file!)
        ),
        onSuccess: () => router.push('/')
    });

	function onFileSelect(files: File[]){
		setPages(pages => [
			...pages, 
			...files.map(file => ({ 
				id: crypto.randomUUID(),
				url: URL.createObjectURL(file),
				file
			}))
		])
	}

	function onSave(){
		if(tags.length < 1){
			toast.create({
				description: 'At least one Tag is required.'
			})
			return;
		}

		if(pages.length < 1){
			toast.create({
				description: 'At least one Page is required.'
			})
			return;
		}

		addDoc.mutate();
	}

	const showUploadForm = pages.length > 0 || tags.length > 0

	return (<>
		<SubRoute.Header>
			<button className="flex" onClick={ onSave } disabled={ addDoc.isPending }>
				<span 
					className={ twJoin(
						'iconify m-6 ml-3',
						addDoc.isPending
							? 'lucide--loader-circle animate-spin' 
							: 'lucide--save'
					) }
				/>
			</button>
		</SubRoute.Header>
		<SubRoute.Body className='flex flex-col gap-4'>
			{ !showUploadForm &&
				<FileSelect onSelected={ onFileSelect }/>
			}
			{ showUploadForm &&
				<DetailView
					editMode
					pages={ pages }
					onPagesChange={ setPages }
					tags={ tags }
					onTagsChange={ setTags }
				/>
			}
		</SubRoute.Body>

	</>);
};

export default Upload;