'use client'

import type { ChangeEvent, FC } from 'react';
import { useEffect, useId, useRef, useState } from 'react';
import * as dialog from "@zag-js/dialog"
import { useMachine, normalizeProps, Portal } from "@zag-js/react"
import { twMerge } from 'tailwind-merge';
import UploadForm from './UploadForm';


interface UploadProps {
    className?: string
}

const Upload: FC<UploadProps> = (props) => {
    const [fileInput, setFileInput] = useState<File[] | undefined>();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [fileSelectLoading, setFileSelectLoading] = useState(false);
	const formRef = useRef<HTMLFormElement>(null);

	const [dialogState, dialogSend] = useMachine(dialog.machine({ id: useId() }), {
		context : {
			role: 'dialog',
			closeOnEscape: true,
			modal: true
		}
	})
	const dialogApi = dialog.connect(dialogState, dialogSend, normalizeProps)

	function choseFiles(event: ChangeEvent<HTMLInputElement>){
		setFileSelectLoading(false);
		const fileList = event.target.files;

		if(fileList === null) return;
		const files = Array.from(fileList)
		if(files.length < 1) return;

		setFileInput(files);
		dialogApi.setOpen(true);
	}

	useEffect(() => {
		const onCancel = () => setFileSelectLoading(false);
		fileInputRef.current?.addEventListener('cancel', onCancel)
		
		return () => fileInputRef.current?.removeEventListener('cancel', onCancel)
	}, []);

	return (<>
		<form ref={ formRef }>
			<label 
				className={ twMerge(
					'bg-violet-600 rounded-full flex items-center justify-center p-4',
					props.className
				) }
				onClick={ () => setFileSelectLoading(true) }
			>
				<input className='sr-only' type='file' multiple onChange={choseFiles} ref={ fileInputRef }/>
				<span className={ twMerge(
					"iconify text-white text-2xl",
					fileSelectLoading ? 'lucide--loader-circle animate-spin' : 'lucide--file-plus'
				) }></span>
			</label>
		</form>
		<Portal>
			<div {...dialogApi.getPositionerProps()} className='absolute inset-0'>
				<div {...dialogApi.getContentProps()} className='bg-gray-900 h-full text-white'>
					<div className='flex flex-col h-full'>
						<h2 {...dialogApi.getTitleProps()} className='grid grid-cols-[1fr_auto] items-center text-xl bg-gray-700 text-gray-300'>
							<span className='ml-6'>Add Document</span>
							<button {...dialogApi.getCloseTriggerProps()} className='flex'>
								<span className='iconify lucide--x m-6'></span>
							</button>
						</h2>
						{ fileInput && dialogApi.open && 
							<UploadForm files={ fileInput } onUploaded={ () => dialogApi.setOpen(false) }/> 
						}
					</div>
				</div>
			</div>
		</Portal>
	</>);
};

export default Upload;