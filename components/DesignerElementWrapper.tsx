import { useState } from 'react'
import { useDraggable, useDroppable } from '@dnd-kit/core'
import { BiSolidTrash } from 'react-icons/bi'

import { cn } from '@/lib/utils'
import { FormElementInstance, FormElements } from '@/components/FormElements'
import { Button } from '@/components/ui/button'
import useDesigner from '@/components/hooks/useDesigner'


export default function DesignerElementWrapper({ element }: { element: FormElementInstance }) {
    const { removeElement, selectedElement, setSelectedElement } = useDesigner()
    const [mouseIsOver, setMouseIsOver] = useState<boolean>(false)

    const topHalf = useDroppable({
        id: element.id + '-top',
        data: {
            type: element.type,
            elementId: element.id,
            isTopHalfDesignerElement: true,
        }
    })

    const bottomHalf = useDroppable({
        id: element.id + '-bottom',
        data: {
            type: element.type,
            elementId: element.id,
            isBottomHalfDesignerElement: true,
        }
    })

    const draggable = useDraggable({
        id: element.id + '-drag-handler',
        data: {
            type: element.type,
            elementId: element.id,
            isDesignerElement: true,
        }
    })

    if (draggable.isDragging) return null

    const DesignerElement = FormElements[element.type].designerComponent

    return (
        <div
            ref={draggable.setNodeRef}
            {...draggable.listeners}
            {...draggable.attributes}
            className='relative flex flex-col h-[120px] text-foreground
            hover:cursor-pointer rounded-md ring-1 ring-accent ring-inset'
            onMouseEnter={() => setMouseIsOver(true)}
            onMouseLeave={() => setMouseIsOver(false)}
            onClick={(e) => {
                e.stopPropagation()
                setSelectedElement(element)
            }}
        >
            <div
                ref={topHalf.setNodeRef}
                className='absolute w-full h-1/2 rounded-t-md'
            />
            <div
                ref={bottomHalf.setNodeRef}
                className='absolute w-full bottom-0 h-1/2 rounded-b-md'
            />
            {mouseIsOver &&
                <>
                    <div className='absolute right-0 h-full'>
                        <Button
                            variant='outline'
                            className='flex justify-center h-full border rounded-md rounded-l-none !bg-red-500'
                            onClick={(e) => {
                                e.stopPropagation()
                                removeElement(element.id)
                            }}
                        >
                            <BiSolidTrash className='!h-6 !w-6' />
                        </Button>
                    </div>
                    <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse'>
                        <p className='text-muted-foreground text-sm'>
                            Click for properties or drag to move
                        </p>
                    </div>
                </>
            }
            {topHalf.isOver && <div className='absolute top-0 w-full rounded-md h-[7px] bg-primary rounded-b-none' />}
            {bottomHalf.isOver && <div className='absolute bottom-0 w-full rounded-md h-[7px] bg-primary rounded-t-none' />}
            <div
                className={cn(
                    'flex items-center w-full bg-accent/40 h-[120px] px-4 py-2 rounded-md pointer-events-none opacity-100',
                    mouseIsOver && 'opacity-30',
                )}
            >
                <DesignerElement elementInstance={element} />
            </div>
        </div>
    )
}

