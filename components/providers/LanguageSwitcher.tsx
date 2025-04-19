'use client'

import { useEffect, useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useRouter } from 'next/navigation'


export default function LanguageSwitcher() {
    const [value, setValue] = useState('')
    const options = ['en', 'uz']
    const router = useRouter()

    function changeLocale(newLocale: string) {
        setValue(newLocale)
        document.cookie = `MYNEXTAPP_LOCALE=${newLocale};`
        router.refresh()
    }

    const [ mounted, setMounted ] = useState(false)
    useEffect(() => {
        setMounted(true)

        const cookiesLocale = document.cookie.split('; ').find(row =>
            row.startsWith('MYNEXTAPP_LOCALE='))?.split('=')[1]

        if (cookiesLocale) {
            setValue(cookiesLocale)
        } else {
            setValue('en')
            document.cookie = `MYNEXTAPP_LOCALE=en;`
            router.refresh()
        }

    }, [router])
    if (!mounted) return null

    return (
        <Select
            defaultValue={value}
            onValueChange={changeLocale}
        >
            <SelectTrigger
                className=''
            >
                <SelectValue placeholder={value} />
            </SelectTrigger>
            <SelectContent className='min-w-0'>
                {options.map(option =>
                    <SelectItem key={option} value={option}>
                        {option}
                    </SelectItem>
                )}
            </SelectContent>
        </Select>
    )
}

