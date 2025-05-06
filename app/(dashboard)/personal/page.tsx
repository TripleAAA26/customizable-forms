import { Suspense } from 'react'

import { Separator } from '@/components/ui/separator'
import StatsCards from '@/components/personalPage/StatsCards'
import CardStatsWrapper from '@/components/personalPage/CardStatsWrapper'
import FormTable from '@/components/personalPage/FormTable'
import { getTranslations } from 'next-intl/server'
import { GetForms } from '@/actions/form'
import { columns } from '@/components/personalPage/FormColumns'

export default async function PersonalPage() {
    const t = await getTranslations('HomePage')
    const forms = await GetForms()

    return (
        <div className='container pt-4'>
            <Suspense fallback={<StatsCards loading={true}/>}>
                <CardStatsWrapper />
            </Suspense>
            <Separator className='my-6' />
            <h2 className='text-4xl font-bold col-span-2'>{t('title')}</h2>
            <Separator className='my-6' />
            <div className=''>
                <FormTable data={forms} columns={columns} />
            </div>
        </div>
    )
}