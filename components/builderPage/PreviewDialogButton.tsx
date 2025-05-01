'use client'

import { MdPreview } from 'react-icons/md'

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import useDesigner from '@/components/hooks/useDesigner'
import { FormElements } from '@/components/FormElements'
import { useTranslations } from 'next-intl'

export default function PreviewDialogButton() {
    const t = useTranslations('BuilderPage.PreviewDialogButtonComponent')
    const { elements } = useDesigner()

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant='outline' className='gap-2'>
                    <MdPreview className='!h-6 !w-6' />
                    {t('preview-button')}
                </Button>
            </DialogTrigger>
            <DialogContent
                className='w-screen h-screen max-h-screen !max-w-full flex flex-col flex-grow p-0 gap-0'
            >
                <div className='px-4 py-2 border-b'>
                    <DialogTitle />
                    <p className='text-lg font-bold text-muted-foreground'>
                        {t('preview-dialog-title')}
                    </p>
                    <p className='text-sm text-muted-foreground'>
                        {t('preview-dialog-description')}
                    </p>
                </div>
                <div
                    className='bg-accent flex flex-col flex-grow justify-center items-center p-4
                    bg-[url(/tiny-checkers.svg)] dark:bg-[url(/tiny-checkers-dark.svg)] overflow-y-auto'
                >
                    <div
                        className='max-w-[620px] flex flex-col flex-grow gap-4
                        bg-background h-full w-full rounded-2xl p-8 overflow-y-auto'
                    >
                        {elements.map(element => {
                            const FormComponent = FormElements[element.type].formComponent
                            return <FormComponent key={element.id} elementInstance={element} />
                        })}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

