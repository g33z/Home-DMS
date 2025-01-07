import { useRef, useState, type FC } from 'react';
import Tag from './Tag';
import { twMerge } from 'tailwind-merge';
import { TagType } from '../lib/document/service';

interface TagInputProps {
    tags: TagType[]
    onTagsChange: (change: (tags: TagType[]) => TagType[]) => void
    editable?: boolean
    className?: string
}

const TagInput: FC<TagInputProps> = (props) => {
    const [titleInput, setTitleInput] = useState('');
    const formRef = useRef<HTMLFormElement>(null);

    function removeTag(keyword: string){
        props.onTagsChange(oldTags => oldTags.filter(t => t.keyword !== keyword))
    }
    
    return (
        <form
            onSubmit={ e => {
                e.preventDefault();
                props.onTagsChange(oldTags => {
                    if(oldTags.some(t => t.keyword === titleInput)) return oldTags;
                    return [...oldTags, { keyword: titleInput }];
                })
                formRef.current?.reset()
            } }
            ref={ formRef }
            className={ twMerge('flex flex-col gap-3 min-h-0', props.className) }
        >
            { props.editable &&
                <label className='text-2xl flex gap-3 text-gray-200 has-[:focus-visible]:text-white'>
                    <span className='iconify lucide--tag h-8 shrink-0'></span>
                    <input
                        type='text'
                        className='bg-transparent outline-none min-w-0 resize-none' 
                        placeholder='Add Tags...'
                        onChange={ ({ target }) => setTitleInput(target.value) }
                        required
                    />
                </label>
            }
            <div className='overflow-y-auto'>
                <ul className='flex gap-1 flex-wrap'>
                    { props.tags.map(tag =>
                        <li key={ tag.keyword }>
                            <Tag
                                keyword={ tag.keyword }
                                onClick={ props.editable ? () => removeTag(tag.keyword) : undefined }
                                deletable={ props.editable ?? false }
                            />
                        </li>
                    )}
                    <div className='w-6 shrink-0'></div>
                </ul>
            </div>
        </form>
    );
};

export default TagInput;