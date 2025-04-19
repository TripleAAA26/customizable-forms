import { useTransition } from 'react'
import { HiSaveAs } from 'react-icons/hi'

import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import useDesigner from '@/components/hooks/useDesigner'
import { UpdateFormContent } from '@/actions/form'
import { FaSpinner } from 'react-icons/fa'

export default function SaveFormButton({ id }: { id: number }) {
    const { elements } = useDesigner()
    const [loading, startTransition] = useTransition()

    async function updateFormContent() {
        try {
            const JsonElements = JSON.stringify(elements)
            await UpdateFormContent(id, JsonElements)
            toast.success('Success', { description: 'Your form has been saved' })
        } catch (error) {
            toast.error('Error', { description: 'Something went wrong' })
        }
    }

    return (
        <Button
            variant='outline'
            className='gap-2'
            disabled={loading}
            onClick={() => startTransition(updateFormContent)}
        >
            <HiSaveAs className='!h-4 !w-4' />
            Save
            {loading && <FaSpinner className='animate-spin' />}
        </Button>
    )
}

