'use client'

import type { FC } from 'react';
import { useState } from 'react';
import supabase from '../lib/supabase/client';
import { useRouter_UNSTABLE as useRouter } from 'waku';

interface UploadProps {
    
}

const Upload: FC<UploadProps> = (props) => {
    const [fileInput, setFileInput] = useState<File[] | undefined>();
	const router = useRouter();

	function upload(){
		if(fileInput === undefined) return;

		const uploads = 
			fileInput.map(file => supabase.storage
				.from('documents')
				.upload(
					crypto.randomUUID(), 
					file, 
					{ 
						upsert: true, 
						metadata: { name: file.name }
					}
				)
				.then(({ data, error }) => {
					if(error) throw error;
				})
			);
		
		Promise
			.all(uploads)
			.then(() => router.push('/'));
	}

	return (
		<div>
			<input 
				multiple
				type="file" 
					onChange={ ({ target: { files } }) => {
					if(!files) return;
					setFileInput(Array.from(files))
				} } 
			/>
			<button disabled={ fileInput === undefined } onClick={upload}>upload</button>
		</div>
	);
};

export default Upload;