
import { Separator } from '@/components/ui/separator'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function Home() {

    return (
        <div className='container pt-4'>
            <div className='flex justify-between items-center'>
                <h2 className='text-4xl font-bold col-span-2'>Home Page</h2>
                <Button>
                    <Link href={'/personal'}>Personal page</Link>
                </Button>
            </div>
            <Separator className='my-6' />
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                Most viewed Forms
            </div>
        </div>
    )
}