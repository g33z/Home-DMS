'use client'

import * as menu from "@zag-js/menu"
import { useMachine, normalizeProps, Portal } from "@zag-js/react"
import { useState, type FC } from 'react';

interface MenuOption{
    label: string, 
    icon: string
}

interface MenuProps<Options extends Record<string, MenuOption>> {
    onSelect: (selected: keyof Options) => void
}

const menuOptions = {
    edit: {
        label: 'Edit', 
        icon: 'lucide--edit'
    },
    delete: { 
        label: 'Delete', 
        icon: 'lucide--trash'
    }
} as const satisfies Record<string, MenuOption>

export type MenuOptions = keyof typeof menuOptions;


const Menu: FC<MenuProps<typeof menuOptions>> = (props) => {
    const [state, send] = useMachine(
        menu.machine({ 
            id: 'detail-view-menu',
            onSelect: d => props.onSelect(d.value as MenuOptions)
        }), 
        {
            context: {
                positioning: {
                    gutter: 0,
                    overflowPadding: 0
                }
            }
        }
    )

    const api = menu.connect(state, send, normalizeProps)

    return (<>
        <button {...api.getTriggerProps()} className="flex data-[state=open]:bg-gray-600">
            <span {...api.getIndicatorProps()} className='iconify lucide--more-vertical m-6'></span>
        </button>
        <Portal>
            <div {...api.getPositionerProps()}>
                <ul {...api.getContentProps()} className='hidden data-[state=open]:flex text-white py-4 px-5 text-xl rounded-lg rounded-tr-none bg-gray-600 flex-col gap-2'>
                    { Object.entries(menuOptions).map(([value, option]) => 
                        <li key={ value } {...api.getItemProps({ value })} className='flex gap-2 items-center cursor-pointer'>
                            <span className={ `iconify ${option.icon} text-gray-300` }/>
                            { option.label }
                        </li>
                    )}
                </ul>
            </div>
        </Portal>
    </>)
};

export default Menu;