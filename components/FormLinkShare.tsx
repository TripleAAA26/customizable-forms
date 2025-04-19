'use client'

import { useEffect, useState } from 'react'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ImShare } from 'react-icons/im'
import { toast } from 'sonner'

export default function FormLinkShare({shareUrl}: {shareUrl: string}) {
    const [mounted, setMounted] = useState<boolean>(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    const shareLink = `${window.location.origin}/submit/${shareUrl}`

    return (
        <div className='flex flex-grow gap-4 items-center'>
            <Input value={shareLink} readOnly />
            <Button
                className='w-[200px]'
                onClick={() => {
                    navigator.clipboard.writeText(shareLink)
                    toast.success('Copied!', { description: 'Link copied to clipboard' })
                }}
            >
                <ImShare className='mr-2 !h-4 !w-4' />
                Share link
            </Button>
        </div>
    )
}

