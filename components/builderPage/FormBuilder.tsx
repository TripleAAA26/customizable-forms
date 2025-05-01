'use client'

import { Form, Prisma } from '@prisma/client'
type FormWithQuestions = Prisma.FormGetPayload<{
    include: { questions: true }
}>
import { DndContext, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import { useEffect, useState } from 'react'

import PreviewDialogButton from '@/components/builderPage/PreviewDialogButton'
import SaveFormButton from '@/components/builderPage/SaveFormButton'
import PublishFormButton from '@/components/builderPage/PublishFormButton'
import Designer from '@/components/builderPage/Designer'
import DragOverlayWrapper from '@/components/builderPage/DragOverlayWrapper'
import useDesigner from '@/components/hooks/useDesigner'
import { ImSpinner2 } from 'react-icons/im'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import Link from 'next/link'
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs'
import Confetti from 'react-confetti'
import { FormElementInstance } from '@/components/FormElements'
import { useTranslations } from 'next-intl'

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


    const shareUrl = `${window.location.origin}/submit/${form.shareURL}`

    if (form.published) {
        return (
            <>
                <Confetti
                    width={window.innerWidth}
                    height={window.innerHeight}
                    recycle={false}
                    numberOfPieces={1000}
                />
                <div className='flex flex-col items-center justify-center w-full h-full'>
                    <div className='max-w-md'>
                        <h1 className='text-center text-4xl font-bold text-primary border-b pb-2 mb-10'>
                            🎉{t('form-published')}🎉
                        </h1>
                        <h2 className='text-2xl'>
                            {t('share-from')}
                        </h2>
                        <h3 className='text-xl text-muted-foreground border-b pb-10'>
                            {t('share-description')}
                        </h3>
                        <div className='my-4 flex flex-col items-center w-full border-b pb-4'>
                            <Input className='w-full' readOnly value={shareUrl} />
                            <Button
                                className='mt-2 w-full'
                                onClick={() => {
                                    navigator.clipboard.writeText(shareUrl)
                                    toast.success('Copied!', { description: 'Link copied to clipboard' })
                                }}
                            >
                                {t('copy-link-button')}
                            </Button>
                        </div>
                        <div className='flex justify-between'>
                            <Button asChild variant='link'>
                                <Link href='/' className='gap-2'>
                                    <BsArrowLeft />
                                    {t('back-home-button')}
                                </Link>
                            </Button>
                            <Button asChild variant='link'>
                                <Link href={`/forms/${form.id}`} className='gap-2'>
                                    {t('form-details-button')}
                                    <BsArrowRight />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </>
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
                        <PreviewDialogButton/>
                        {!form.published &&
                            <>
                                <SaveFormButton id={form.id} />
                                <PublishFormButton id={form.id} />
                            </>
                        }
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

