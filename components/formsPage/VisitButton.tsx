'use client'

import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'

export default function VisitButton({shareUrl}: {shareUrl: string}) {
    const [mounted, setMounted] = useState<boolean>(false)
    const t = useTranslations('FormsPage')
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
            {t('visit-button')}
        </Button>
    )
}

