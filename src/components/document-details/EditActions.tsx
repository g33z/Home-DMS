import type { FC } from 'react';
import { twJoin } from 'tailwind-merge';

interface EditActionsProps {
    onCancel: () => void
    onSave: () => void
    loading: boolean
}

const EditActions: FC<EditActionsProps> = (props) => {
    
    return (<>
        <button className="flex" onClick={ props.onCancel }>
            <span className='iconify lucide--x m-6 mr-3'></span>
        </button>
        <button className="flex" onClick={ props.onSave }>
            <span 
                className={ twJoin(
                    'iconify m-6 ml-3',
                    props.loading 
                        ? 'lucide--loader-circle animate-spin' 
                        : 'lucide--save'
                ) }
            />
        </button>
    </>);
};

export default EditActions;