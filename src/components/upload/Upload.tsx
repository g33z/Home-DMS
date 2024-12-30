'use client'

import type { ChangeEvent, FC } from 'react';
import { useEffect, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import UploadForm from './UploadForm';
import { useRouter_UNSTABLE as useRouter } from 'waku';


interface UploadProps {
    className?: string
}

const Upload: FC<UploadProps> = (props) => {
    const [fileInput, setFileInput] = useState<File[] | undefined>();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [fileSelectLoading, setFileSelectLoading] = useState(false);

	const router = useRouter();

	function choseFiles(event: ChangeEvent<HTMLInputElement>){
		setFileSelectLoading(false);
		const fileList = event.target.files;

		if(fileList === null) return;
		const files = Array.from(fileList)
		if(files.length < 1) return;

		setFileInput(files);
	}

	useEffect(() => {
		const onCancel = () => setFileSelectLoading(false);
		fileInputRef.current?.addEventListener('cancel', onCancel)
		
		return () => fileInputRef.current?.removeEventListener('cancel', onCancel)
	}, []);

	useEffect(() => {
		if(history.state === null) return; // is the page loaded by user or by link
		fileInputRef.current?.click();
	}, []);

	if(fileInput === undefined) return (
		<label 
			className={ twMerge(
				'h-full flex flex-col items-center justify-center p-4 text-xl text-white gap-5 cursor-pointer',
				props.className
			) }
			onClick={ () => setFileSelectLoading(true) }
		>
			<input 
				className='sr-only' 
				type='file' 
				multiple 
				onChange={choseFiles} 
				ref={ fileInputRef }
			/>
			<span className={ twMerge(
				"iconify text-5xl",
				fileSelectLoading ? 'lucide--loader-circle animate-spin' : 'lucide--file-plus'
			) }></span>
			<h2>{ fileSelectLoading ? 'Selecting' : 'Select' } File(s)</h2>
		</label>
	)

	return (
		<UploadForm files={ fileInput } onUploaded={ () => router.push('/') }/>
	);
};

export default Upload;