import type { FC } from 'react';
import { useActor, useMachine, normalizeProps } from "@zag-js/react"
import * as toast from "@zag-js/toast"

interface ToastProps {
    actor: toast.Service
}

const Toast: FC<ToastProps> = (props) => {
    const [state, send] = useActor(props.actor)
    const api = toast.connect(state, send, normalizeProps)
  
    return (
      <div {...api.getRootProps()} className='bg-gray-700 text-white rounded-lg flex items-center m-3 shadow-md'>
        <p {...api.getDescriptionProps()} className='m-3'>
            { api.description }
        </p>
        <div className='border-r border-gray-500 shrink-0 my-3 self-stretch'/>
        <button onClick={api.dismiss} className='flex items-center justify-center w-12 h-12'>
            <span className='iconify lucide--x'/>
        </button>
      </div>
    )
};

export default Toast;