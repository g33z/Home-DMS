'use client'

import { useId, type FC, type PropsWithChildren } from 'react';
import * as toast from "@zag-js/toast"
import { useMachine, normalizeProps } from "@zag-js/react"
import { ToastContext } from './context';
import Toast from './Toast';
import './styles.css'

interface ToastProviderProps {
    
}

const ToastProvider: FC<PropsWithChildren<ToastProviderProps>> = (props) => {
    const [state, send] = useMachine(toast.group.machine({ 
        id: useId(),
        gap: 8
    }))

    const api = toast.group.connect(state, send, normalizeProps)
  
    return (
        <ToastContext.Provider value={ api }>
            {
                api.getPlacements().map((placement) => (
                    <div key={ placement } {...api.getGroupProps({ placement })}>
                        { api.getToastsByPlacement(placement).map((toast) => (
                            <Toast key={ toast.id } actor={ toast } />
                        ))}
                    </div>
                ))
            }
            { props.children }
        </ToastContext.Provider>
    )
};

export default ToastProvider;