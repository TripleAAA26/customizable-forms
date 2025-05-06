'use client'

import { Form, Prisma } from '@prisma/client'
type FormWithQuestions = Prisma.FormGetPayload<{
    include: { questions: true }
}>
import { DndContext, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import { useEffect, useState } from 'react'

import PreviewDialogButton from '@/components/builderPage/PreviewDialogButton'
import SaveFormButton from '@/components/builderPage/SaveFormButton'
import Designer from '@/components/builderPage/Designer'
import DragOverlayWrapper from '@/components/builderPage/DragOverlayWrapper'
import useDesigner from '@/components/hooks/useDesigner'
import { ImSpinner2 } from 'react-icons/im'
import { FormElementInstance } from '@/components/FormElements'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function FormBuilder({ form }: { form: FormWithQuestions }) {
    const { setElements, setSelectedElement } = useDesigner()
    const [isReady, setIsReady] = useState(false)
    const t = useTranslations('BuilderPage.formBuilderComponent')

    const mouseSensor = useSensor(MouseSensor, {
        activationConstraint: {
            distance: 10,
        }
    })

    const touchSensor = useSensor(TouchSensor, {
        activationConstraint: {
            delay: 300,
            tolerance: 5,
        }
    })

    const sensors = useSensors(mouseSensor, touchSensor)

    useEffect(() => {
        if (isReady) return
        const elements = form.questions as FormElementInstance[]
        setElements(elements)
        setSelectedElement(null)
        const readyTimeout = setTimeout(() => setIsReady(true), 500)
        return () => clearTimeout(readyTimeout)
    }, [form, setElements, isReady, setSelectedElement])

    if (!isReady) {
        return (
            <div className='flex flex-col items-center justify-center w-full h-full'>
                <ImSpinner2 className='animate-spin h-12 w-12' />
            </div>
        )
    }


    return (
        <DndContext sensors={sensors}>
            <main className='flex flex-col w-full'>
                <nav className='flex justify-between items-center border-b-2 p-4 gap-3'>
                    <h2 className='truncate font-medium'>
                        <span className='text-muted-foreground mr-2'>{t('form')}:</span>
                        {form.name}
                    </h2>
                    <div className='flex items-center gap-2'>
                        <Button asChild variant='outline'>
                            <Link href='/personal'>
                                Personal page
                            </Link>
                        </Button>
                        <PreviewDialogButton/>
                        <SaveFormButton id={form.id} />
                    </div>
                </nav>
                <div
                    className='flex flex-grow w-full items-center justify-center relative overflow-y-auto bg-accent
                    h-[200px] bg-[url(/tiny-checkers.svg)] dark:bg-[url(/tiny-checkers-dark.svg)]'
                >
                    <Designer formId={form.id} />
                </div>
            </main>
            <DragOverlayWrapper />
        </DndContext>
    )
}

