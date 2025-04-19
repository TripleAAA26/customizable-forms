'use client'

import { DragEndEvent, useDndMonitor, useDroppable } from '@dnd-kit/core'

import { cn } from '@/lib/utils'
import DesignerSideBar from '@/components/DesignerSideBar'
import useDesigner from '@/components/hooks/useDesigner'
import { ElementsType, FormElements } from '@/components/FormElements'
import { idGenerator } from '@/lib/idGenerator'
import DesignerElementWrapper from '@/components/DesignerElementWrapper'


export default function Designer() {
    const { elements, addElement, selectedElement, setSelectedElement, removeElement } = useDesigner()

    const droppable = useDroppable({
        id: 'designer-drop-area',
        data: {
            isDesignerDropArea: true,
        }
    })

    useDndMonitor({
        onDragEnd: (event: DragEndEvent) => {
            const { active, over } = event
            if (!active || !over) return

            const isDesignerButtonElement = active.data?.current?.isDesignerButtonElement
            const isDroppingOverDesignerDropArea = over.data?.current?.isDesignerDropArea

            // First scenario: dropping a sidebar button element over the designer drop area
            if (isDesignerButtonElement && isDroppingOverDesignerDropArea) {
                const type = active.data?.current?.type
                const newElement = FormElements[type as ElementsType].construct(
                    idGenerator()
                )
                addElement(elements.length, newElement)
                return
            }

            const isDroppingOverDesignerElementTopHalf = over.data?.current?.isTopHalfDesignerElement
            const isDroppingOverDesignerElementBottomHalf = over.data?.current?.isBottomHalfDesignerElement

            // Second scenario: dropping a sidebar button element over the designer element
            if (isDesignerButtonElement && (isDroppingOverDesignerElementTopHalf || isDroppingOverDesignerElementBottomHalf)) {
                const type = active.data?.current?.type
                const newElement = FormElements[type as ElementsType].construct(
                    idGenerator()
                )

                const overElementIndex = elements.findIndex(el =>
                    el.id === over.data?.current?.elementId
                )
                if (overElementIndex === -1) {
                    throw new Error(`Element not found`)
                }

                let indexForNewElement = overElementIndex // assume top half
                if (isDroppingOverDesignerElementBottomHalf) {
                    indexForNewElement = overElementIndex + 1
                }

                addElement(indexForNewElement, newElement)
                return
            }

            const isDesignerElement = active.data?.current?.isDesignerElement

            // Third scenario: dropping a designer element over the designer element
            if(isDesignerElement && (isDroppingOverDesignerElementTopHalf || isDroppingOverDesignerElementBottomHalf)) {
                const activeId = active.data?.current?.elementId
                const overId = over.data?.current?.elementId

                const activeElementIndex = elements.findIndex((el) =>
                    el.id === activeId
                )
                const overElementIndex = elements.findIndex((el) =>
                    el.id === overId
                )

                if (activeElementIndex === -1 || overElementIndex === -1) {
                    throw new Error(`Element not found`)
                }

                const activeElement = {...elements[activeElementIndex]}
                removeElement(activeId)

                let indexForNewElement = overElementIndex // assume top half
                if (isDroppingOverDesignerElementBottomHalf) {
                    indexForNewElement = overElementIndex + 1
                }

                addElement(indexForNewElement, activeElement)
            }
        }
    })

    return (
        <div className='flex w-full h-full'>
            <div
                className='p-4 w-full'
                onClick={() => {
                    if (selectedElement) setSelectedElement(null)
                }}
            >
                <div
                    ref={droppable.setNodeRef}
                    className={cn(
                        'bg-background max-w-[920px] h-full m-auto rounded-xl flex flex-col flex-grow items-center justify-start flex-1 overflow-y-auto',
                        droppable.isOver && 'ring-2 ring-primary/20'
                    )}
                >
                    {!droppable.isOver && elements.length === 0 &&
                        <p className='text-3xl text-muted-foreground font-bold flex flex-grow items-center'>
                            Drop here
                        </p>
                    }
                    {droppable.isOver && elements.length === 0 &&
                        <div className='p-4 w-full'>
                            <div className='h-[120px] rounded-md bg-primary/20'>
                            </div>
                        </div>
                    }
                    {elements.length > 0 &&
                        <div className='flex flex-col w-full gap-2 p-4'>
                            {elements.map(element =>
                                <DesignerElementWrapper key={element.id} element={element} />
                            )}
                        </div>
                    }
                </div>
            </div>
            <DesignerSideBar />
        </div>
    )
}

