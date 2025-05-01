'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { MdOutlinePublish } from 'react-icons/md'
import { FaSpinner } from 'react-icons/fa'

import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogAction,
    AlertDialogCancel,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { PublishForm } from '@/actions/form'
import { useTranslations } from 'next-intl'

export default function PublishFormButton({ id }: { id: number }) {
    const t = useTranslations('BuilderPage.publishFormButtonComponent')
    const [loading, startTransition] = useTransition()
    const router = useRouter()

    async function publishForm() {
        try {
            await PublishForm(id)
            toast.success('Success', { description: 'You form is now available to public' })
            router.refresh()
        } catch (error) {
            toast.error('Error', { description: 'Something went wrong' })
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button className='gap-2 text-white bg-gradient-to-r from-blue-400 to-green-400'>
                    <MdOutlinePublish className='!h-4 !w-4' />
                    {t('dialog-trigger')}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t('dialog-title')}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {t('dialog-description-first')} <br/> <br/>
                        <span className='font-medium'>
                            {t('dialog-description-second')}
                        </span>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>{t('dialog-cancel')}</AlertDialogCancel>
                    <AlertDialogAction
                        disabled={loading}
                        onClick={e => {
                            e.preventDefault()
                            startTransition(publishForm)
                        }}
                    >
                        {t('dialog-action-proceed')}
                        {loading && <FaSpinner className='animate-spin' />}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

