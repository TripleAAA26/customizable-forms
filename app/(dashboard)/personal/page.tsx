import { Suspense } from 'react'

import { Separator } from '@/components/ui/separator'
import CreateFormButton from '@/components/CreateFormButton'
import StatsCards from '@/components/StatsCards'
import CardStatsWrapper from '@/components/CardStatsWrapper'
import FormCardSkeleton from '@/components/FormCardSkeleton'
import FormCards from '@/components/FormCards'
import { getTranslations } from 'next-intl/server'


export default async function PersonalPage() {
    const t = await getTranslations('HomePage')
    return (
        <div className='container pt-4'>
            <Suspense fallback={<StatsCards loading={true}/>}>
                <CardStatsWrapper />
            </Suspense>
            <Separator className='my-6' />
            <h2 className='text-4xl font-bold col-span-2'>{t('title')}</h2>
            <Separator className='my-6' />
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                <CreateFormButton />
                <Suspense fallback={[0, 1, 2, 4, 5].map(item=> (
                    <FormCardSkeleton key={item} />
                ))}>
                    <FormCards />
                </Suspense>
            </div>
        </div>
    )
}