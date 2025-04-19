'use client'

import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'

export default function VisitButton({shareUrl}: {shareUrl: string}) {
    const [mounted, setMounted] = useState<boolean>(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    const shareLink = `${window.location.origin}/submit/${shareUrl}`

    return (
        <Button
            className='w-[200px]'
            onClick={() => window.open(shareLink, '_blank')}
        >
            Visit
        </Button>
    )
}

