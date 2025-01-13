import { createContext, useContext } from "react"
import { GroupApi } from '@zag-js/toast'

export const ToastContext = createContext<GroupApi>(null as unknown as GroupApi)
export const useToast = () => useContext(ToastContext)