import { useState } from 'react'
import { Active, DragOverlay, useDndMonitor } from '@dnd-kit/core'

import { SideBarButtonElementDragOverlay } from '@/components/builderPage/SideBarButtonElement'
import { ElementsType, FormElements } from '@/components/FormElements'
import useDesigner from '@/components/hooks/useDesigner'

export default function DragOverlayWrapper() {
    const [draggedItem, setDraggedItem] = useState<Active | null>(null)
    const { elements } = useDesigner()

    useDndMonitor({
        onDragStart: (event) => {
            setDraggedItem(event.active)
        },
        onDragCancel: () => {
            setDraggedItem(null)
        },
        onDragEnd: () => {
            setDraggedItem(null)
        }
    })

    if (!draggedItem) return null

    let node = <div>no drag overlay</div>

    const isSideBarButtonElement = draggedItem.data?.current?.isDesignerButtonElement
    if (isSideBarButtonElement) {
        const type = draggedItem.data?.current?.type as ElementsType
        node = <SideBarButtonElementDragOverlay formElement={FormElements[type]} />
    }

    const isDesignerElement = draggedItem.data?.current?.isDesignerElement
    if (isDesignerElement) {
        const elementId = draggedItem.data?.current?.elementId
        const element = elements.find(el => el.id === elementId)
        if (!element) {
            node = <div>Element not found</div>
        } else {
            const DesignerElementComponent = FormElements[element.type].designerComponent

            node = (
                <div className='flex bg-accent border rounded-md h-[120px] w-full py-2 px-4 opacity-80 pointer-events-none'>
                    <DesignerElementComponent elementInstance={element} />
                </div>
            )
        }
    }

    return (
        <DragOverlay>
            {node}
        </DragOverlay>
    )
}

