import { useDraggable } from '@dnd-kit/core'

import { FormElement } from '@/components/FormElements'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'

export default function SideBarButtonElement({ formElement }: { formElement: FormElement }) {
    const t = useTranslations('Fields')
    const { icon: Icon, label } = formElement.designerButtonElement
    const draggable = useDraggable({
        id: `designer-button-${formElement.type}`,
        data: {
            type: formElement.type,
            isDesignerButtonElement: true,
        },
    })

    return (
        <Button
            ref={draggable.setNodeRef}
            variant='outline'
            className={cn(
                'flex flex-col gap-2 cursor-grab h-[120px] w-[120px]',
                draggable.isDragging && 'ring-2 ring-primary'
            )}
            {...draggable.listeners}
            {...draggable.attributes}
        >
            <Icon className='!h-8 !w-8 text-primary cursor-grab' />
            <p className='text-xs'>{t(label)}</p>
        </Button>
    )
}


export function SideBarButtonElementDragOverlay({ formElement }: { formElement: FormElement }) {
    const t = useTranslations('Fields')
    const { icon: Icon, label } = formElement.designerButtonElement
    const draggable = useDraggable({
        id: `designer-button-${formElement.type}`,
        data: {
            type: formElement.type,
            isDesignerButtonElement: true,
        },
    })

    return (
        <Button
            variant='outline'
            className='flex flex-col gap-2 cursor-grab h-[120px] w-[120px]'
        >
            <Icon className='!h-8 !w-8 text-primary cursor-grab' />
            <p className='text-xs'>{t(label)}</p>
        </Button>
    )
}