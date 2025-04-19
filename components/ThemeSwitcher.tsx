'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'


export default function ThemeSwitcher() {
    const { theme, setTheme } = useTheme()
    const [ mounted, setMounted ] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <Tabs defaultValue={theme}>
            <TabsList className='border'>
                <TabsTrigger value='light' onClick={() => setTheme('light')}>
                    <SunIcon className='h-[1.2rem] w-[1.2rem]' />
                </TabsTrigger>
                <TabsTrigger value='dark' onClick={() => setTheme('dark')}>
                    <MoonIcon className='h-[1.2rem] w-[1.2rem] rotate-90 transition-all dark:rotate-0' />
                </TabsTrigger>
                <TabsTrigger value='system' onClick={() => setTheme('system')}>
                    <MonitorIcon className='h-[1.2rem] w-[1.2rem]' />
                </TabsTrigger>
            </TabsList>
        </Tabs>
    )
}

