import { normalizeProps, Portal, useMachine } from '@zag-js/react';
import { useEffect, type FC } from 'react';
import * as dialog from "@zag-js/dialog"

interface DeleteWarningDialogProps {
    open: boolean,
    onOpenChange: (open: boolean) => void
    onDelete: () => void
}

const DeleteWarningDialog: FC<DeleteWarningDialogProps> = (props) => {
    const [state, send] = useMachine(dialog.machine({ 
        id: 'DeleteWarningDialog', 
        open: props.open, 
        onOpenChange: e => props.onOpenChange(e.open) 
    }))

    const api = dialog.connect(state, send, normalizeProps)

    useEffect(() => {
        api.setOpen(props.open)
    }, [props.open]);

    if(api.open) return (
        <Portal>
            <div {...api.getBackdropProps()} className='absolute inset-0 bg-black opacity-35 z-10'/>
            <div {...api.getPositionerProps()} className='absolute inset-0 flex items-center justify-center z-10 text-white m-5'>
                <div {...api.getContentProps()} className='bg-gray-800 rounded-xl overflow-clip'>
                    <h2 {...api.getTitleProps()} className='text-xl bg-gray-700 py-3 px-5'>Delete Document</h2>
                    <div className='p-5 text-lg'>
                        <p {...api.getDescriptionProps()}>
                            The document and all its pages will be lost!
                        </p>
                        <div className='flex gap-5 mt-5'>
                            <button 
                                className='w-full bg-gray-500 px-3 py-1.5 rounded-lg' 
                                {...api.getCloseTriggerProps()}
                            >
                                Cancel
                            </button>
                            <button 
                                className='w-full bg-red-600 px-3 py-1.5 rounded-lg'
                                onClick={ props.onDelete }
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Portal>
    )
};

export default DeleteWarningDialog;