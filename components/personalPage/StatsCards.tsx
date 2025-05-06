import { LuView } from 'react-icons/lu'
import { FaWpforms } from 'react-icons/fa6'
import { HiCursorClick } from 'react-icons/hi'
import { TbArrowBounce } from 'react-icons/tb'
import { GetFormStats } from '@/actions/form'
import StatsCard from '@/components/personalPage/StatsCard'
import { getTranslations } from 'next-intl/server'

interface StatsCardsType {
    data?: Awaited<ReturnType<typeof GetFormStats>>
    loading: boolean
}

export default async function StatsCards({ data, loading }: StatsCardsType) {
    const t = await getTranslations('PersonalPage')
    return (
        <div className='w-full pt-8 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4'>
            <StatsCard
                title={t('total-visits-title')}
                icon={<LuView className='text-blue-600' />}
                helperText={t('total-visits-helper')}
                value={data?.visits.toLocaleString() || ''}
                loading={loading}
                className='shadow-md shadow-blue-600'
            />

            <StatsCard
                title={t('total-submissions-title')}
                icon={<FaWpforms className='text-yellow-600' />}
                helperText={t('total-submissions-helper')}
                value={data?.submissions.toLocaleString() || ''}
                loading={loading}
                className='shadow-md shadow-yellow-600'
            />

            <StatsCard
                title={t('submission-rate-title')}
                icon={<HiCursorClick className='text-green-600' />}
                helperText={t('submission-rate-helper')}
                value={data?.submissionRate.toLocaleString() + '%' || ''}
                loading={loading}
                className='shadow-md shadow-green-600'
            />

            <StatsCard
                title={t('bounce-rate-title')}
                icon={<TbArrowBounce className='text-red-600' />}
                helperText={t('bounce-rate-helper')}
                value={data?.bounceRate.toLocaleString() + '%' || ''}
                loading={loading}
                className='shadow-md shadow-red-600'
            />
        </div>
    )
}