import { useRef, useState, type FC } from 'react';
import Tag from '../Tag';

interface TagItem {
    id: string
    keyword: string
}

interface TagInputProps {
    tags: TagItem[]
    onTagsChange: (change: (tags: TagItem[]) => TagItem[]) => void
}

const TagInput: FC<TagInputProps> = (props) => {
    const [titleInput, setTitleInput] = useState('');
    const formRef = useRef<HTMLFormElement>(null);
    
    return (
        <form
            onSubmit={ e => {
                e.preventDefault();
                props.onTagsChange(oldTags => [
                    {
                        id: crypto.randomUUID(),
                        keyword: titleInput
                    },
                    ...oldTags.filter(({keyword}) => keyword !== titleInput)
                ])
                formRef.current?.reset()
            } }
            ref={ formRef }
            className='flex flex-col gap-3 min-h-0'
        >
            <label className='text-2xl flex gap-3 text-gray-200 has-[:focus-visible]:text-white mx-6'>
                <span className='iconify lucide--tag h-8 shrink-0'></span>
                <input
                    type='text'
                    className='bg-transparent outline-none min-w-0 resize-none' 
                    placeholder='Add Tags...'
                    onChange={ ({ target }) => setTitleInput(target.value) }
                    required
                />
            </label>
            <div className='overflow-y-auto'>
                <ul className='flex gap-1 mx-6 flex-wrap'>
                    { props.tags.map(tag =>
                        <li key={ tag.id }>
                            <Tag
                                keyword={ tag.keyword }
                                onClick={ () => props.onTagsChange(oldTags => oldTags.filter(({id}) => id !== tag.id)) }
                                deletable
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