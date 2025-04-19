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

export default function PublishFormButton({ id }: { id: number }) {
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
                    Publish
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. After publishing you will not be able to edit this form. <br/> <br/>
                        <span className='font-medium'>
                            By publishing this form you will make it available to the public
                            and you will be able to collect submission.
                        </span>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        disabled={loading}
                        onClick={e => {
                            e.preventDefault()
                            startTransition(publishForm)
                        }}
                    >
                        Proceed
                        {loading && <FaSpinner className='animate-spin' />}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

